json.extract! @tag, :id, :name, :things, :created_at, :updated_at
json.url tag_url(@tag, format: :json)
