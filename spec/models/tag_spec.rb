require 'rails_helper'

RSpec.describe Tag, type: :model do
  include_context "db_cleanup_each"

  context "valid tag" do
    let(:tag) { FactoryGirl.create(:tag) }

    it "has a name" do
      expect(Tag.find(tag.id).name).to eq(tag.name)
    end
  end

  context "invalid tag" do
    let(:tag) { FactoryGirl.build(:tag, name: nil) }

    it "does not have a name" do
      expect(tag.validate).to be(false)
      expect(tag.errors.messages[:name]).to include("can't be blank")
    end
  end
end
