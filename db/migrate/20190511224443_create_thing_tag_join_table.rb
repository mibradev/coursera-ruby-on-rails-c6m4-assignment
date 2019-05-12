class CreateThingTagJoinTable < ActiveRecord::Migration
  def change
    create_join_table :things, :tags do |t|
      t.index [:thing_id, :tag_id], unique:true
    end
  end
end
