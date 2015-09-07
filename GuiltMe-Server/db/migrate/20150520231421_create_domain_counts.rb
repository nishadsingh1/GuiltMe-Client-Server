class CreateDomainCounts < ActiveRecord::Migration
  def change
    create_table :domain_counts do |t|
      t.string :domain_name
      t.string :counts
    end
  end
end
