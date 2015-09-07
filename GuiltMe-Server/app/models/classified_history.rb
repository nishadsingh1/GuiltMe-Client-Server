class ClassifiedHistory

  # Perceptron-based classification – can change later to K-NN or Bayes Net (perhaps as a meta variable)
  def classify(urls)
    @class_to_url_hash = {}
    Classification.all.each do |classification|
      @class_to_url_hash[classification.name] = Array.new
    end
    urls.each do |url|
      classification_name = Classifier.classify_url(url)
      @class_to_url_hash[classification_name].append url
    end
  end

  def as_json(options={})
    @class_to_url_hash
  end

end
