class ClassificationController < ApplicationController
  def classify
    classified_history = ClassifiedHistory.new
    #params should have {... "history": { "url1": 123.23, ....}... }
    classified_history.classify(params[:history])
    render json: classified_history
  end

end
