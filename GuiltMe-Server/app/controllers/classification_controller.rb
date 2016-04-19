class ClassificationController < ApplicationController
  def classify
    classified_history = ClassifiedHistory.new
    classified_history.classify(params[:history])
    render json: classified_history
  end
  
  def classify_url
  	classification = Classifier.classify_url(params[:url])
  	render json: {"classification" => classification}
  end

end
