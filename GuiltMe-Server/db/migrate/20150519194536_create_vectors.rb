class CreateVectors < ActiveRecord::Migration
  def change
    create_table :vectors do |t|
      t.string :weights
    end
  end
end
