class Classification < ActiveRecord::Base
  attr_accessible :name, :vector
  belongs_to :vector
  has_many :datapoints
  validates :name, presence: true
  validates :vector, presence: true

  def self.find_or_create(name)
    Classification.find_by_name(name) || Classification.create_and_initialize(name)
  end

  def self.initialize_weight_vectors
    Classification.all.each do |classification|
      classification.initialize_weight_vector
    end
  end

  def initialize_weight_vector
    vector = self.vector || Vector.new
    vector.initialize_weights_for_classification
    vector.save
    self.vector = vector
    self.save
  end

  def self.create_and_initialize(name)
    classification = Classification.new
    classification.name = name
    classification.initialize_weight_vector
    classification
  end

end
