class Learner
  class << self
    def instance
      @instance ||= new
    end

    def learn
      setup
      classification_to_weights = {}
      
      PerceptronLearner.learn
      report
    end

    private :new
    private
    def setup
      Classification.initialize_weight_vectors
    end

    def report
      classified_correctly = Array.new
      classified_incorrectly = Array.new
      Datapoint.all.each do |datapoint|
        if datapoint.classification.name == Classifier.classify_url(datapoint.url)
          classified_correctly << datapoint.url
        else
          classified_incorrectly << datapoint.url
        end
      end
      {"classified_correctly" => classified_correctly, "classified_incorrectly" => classified_incorrectly}
    end
  end
end