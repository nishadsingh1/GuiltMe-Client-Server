class DomainCounts < ActiveRecord::Base
  attr_accessible :domain_name, :counts
  serialize :counts
  validates_presence_of :domain_name, :counts
  validates_uniqueness_of :domain_name
  after_initialize :initialize_counts

  def initialize_counts
    unless self.counts
      self.counts = {}
    end
    Classification.all.each do |classification|
      self.counts[classification.name] ||= 0
    end
  end

  def self.find_or_create(domain_name)
    DomainCounts.find_by_domain_name(domain_name) || DomainCounts.create(:domain_name => domain_name)
  end

  def total_counts
    sum = 0
    self.counts.each do |classification_name, count|
      sum += count
    end
    sum
  end

  def self.update_counts(datapoint, old_classification = nil)
    domain_name = get_host_without_www(datapoint.url)
    domain_counts = find_or_create(domain_name)
    domain_counts.counts[datapoint.classification.name] += 1
    if old_classification
      domain_counts.counts[old_classification.name] -= 1
    end
    domain_counts.save
  end

  # Functions like a Naive Bayes' Net 
  def self.get_expectation(url, classification_name, laplace_smoothing_factor)
    domain_name = get_host_without_www(url)
    domain_counts = DomainCounts.find_by_domain_name(domain_name)
    total_counts = domain_counts.nil? ? 0 : domain_counts.total_counts
    classification_counts = domain_counts.nil? ? 0 : domain_counts.counts[classification_name]
    laplace_denominator = Classification.all.size * laplace_smoothing_factor + total_counts
    (classification_counts + laplace_smoothing_factor).to_f / laplace_denominator
  end

  def self.get_host_without_www(url)
    uri = URI.parse(url)
    uri = URI.parse("http://#{url}") if uri.scheme.nil?
    host = uri.host.downcase
    host.start_with?('www.') ? host[4..-1] : host
  end
end
