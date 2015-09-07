class LearningController < ApplicationController
  def learn
    # if params[:auth] == YAML.load_file('config/application.yml')["learning_key"]
    render json: Learner.learn.to_json
    # else
    #   render json: {"error" => "invalid credentials"}.to_json
    end
  end
end
