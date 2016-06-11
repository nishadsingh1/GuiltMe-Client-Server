class FeatureVectorCreator
  class << self
    
    private :new

    def instance
      @instance ||= new
    end

    def feature_functions
      self.methods.select {|f| f.to_s.start_with? 'f_'}.sort_by { |f| f.to_s }
    end

    def size
      feature_functions.size
    end

    def get_vector(url, laplace_factor = 1)
      feature_vector = Vector.new
      feature_functions.each do |f|
        feature_vector << self.send(f,url, laplace_factor)
      end
      feature_vector
    end

    def has_bias?
      bias_position != -1
    end

    def bias_position
      functions = feature_functions
      unless functions.select {|f| f.to_s.include? 'bias'}.any?
        return false
      end
      functions.each_index.select{|i| functions[i].to_s.include? 'bias'}.first
    end

    # All of the following methods will be features, done in alphabetical ordering. Include an 'f_' before each one.
    def f_bias(url, laplace_factor)
      1
    end

    Classification.all.each do |classification|
      define_method("f_expectation_domain_name_is_#{classification.name}") do |url, laplace_factor|
        DomainCounts.get_expectation(url, classification.name, laplace_factor)
      end
    end

    # ['com', 'net', 'edu', 'org', 'me', 'io'].each do |extension|
    #   define_method("f_extension_is_#{extension}") do |url, laplace_factor|
    #     extension == URI.parse(url).host.split('.').last ? 1 : 0
    #   end
    # end

  end
end