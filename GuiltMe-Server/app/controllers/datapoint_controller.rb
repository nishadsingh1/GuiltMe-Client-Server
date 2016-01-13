class DatapointController < ApplicationController
  respond_to :json
  def create
    new_classification = Classification.find_or_create(params[:classification])
    datapoint = Datapoint.new_or_overwrite(params[:url], new_classification)
    render json: datapoint
    chosen_classification = Classifier.classify_url(datapoint.url)
    unless new_classification.name == chosen_classification
      chosen_vector = Classification.find_by_name(chosen_classification).vector
      correct_vector = new_classification.vector  
      feature_vector = FeatureVectorCreator.get_vector(datapoint.url)
      PerceptronLearner.mira_update(correct_vector, chosen_vector, feature_vector)
    end
  end
end
