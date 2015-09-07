class Classifier
  class << self

    def instance
      @instance ||= new
    end
    
    def classification_values(url)
      vector = FeatureVectorCreator.get_vector(url)
      class_outcomes = {}
      Classification.all.each do |classification|
        class_outcomes[classification.name] = classification.vector*vector
      end
      class_outcomes
    end

    def classify_url(url)
      classification_values(url).max_by{|k,v| v}[0]
    end

    private :new
  end
end