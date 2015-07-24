class Datapoint < ActiveRecord::Base
  attr_accessible :url, :classification
  belongs_to :classification
  validates_presence_of :classification, :url
  validates_uniqueness_of :url

  def self.new_or_overwrite(url, classification)
    old_datapoint = Datapoint.find_by_url(url)
    old_classification = old_datapoint ? old_datapoint.classification : nil
    datapoint = old_datapoint || Datapoint.new(:url => url)
    datapoint.classification = classification
    datapoint.save
    DomainCounts.update_counts(datapoint, old_classification)
    datapoint
  end

  def as_json(options={})
    {'url' => self.url, 'classification' => self.classification.name}
  end

end
