# Adds in datapoints in the same way that the POST /datapoint endpoint does

datapoint_list = YAML.load_file('db/seed.yml')

datapoint_list.each do |url, classification_name|
  classification = Classification.find_or_create(classification_name)
  Datapoint.new_or_overwrite(url, classification)
end
