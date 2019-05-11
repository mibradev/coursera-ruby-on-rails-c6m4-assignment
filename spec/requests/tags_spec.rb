require 'rails_helper'

RSpec.describe "Tags", type: :request do
  include_context "db_cleanup_each"

  let(:tag) { FactoryGirl.create(:tag) }
  let(:tag_props) { FactoryGirl.attributes_for(:tag) }

  shared_examples "cannot create" do |status|
    it "fails to create with #{status}" do
      jpost tags_path, tag_props
      expect(response).to have_http_status(status)
      expect(parsed_body).to include("errors")
    end
  end

  shared_examples "cannot update" do |status|
    it "fails to update with #{status}" do
      jput tag_path(tag)
      expect(response).to have_http_status(status)
      expect(parsed_body).to include("errors")
    end
  end

  shared_examples "cannot delete" do |status|
    it "fails to delete with #{status}" do
      jdelete tag_path(tag), tag_props
      expect(response).to have_http_status(status)
      expect(parsed_body).to include("errors")
    end
  end

  context "anonymous user" do
    it_should_behave_like "cannot create", :unauthorized
    it_should_behave_like "cannot update", :unauthorized
    it_should_behave_like "cannot delete", :unauthorized
  end

  context "originator" do
    let(:originator) { apply_originator(signup(FactoryGirl.attributes_for(:user)), Tag) }
    let!(:user) { login originator }

    it_should_behave_like "resource index", :tag
    it_should_behave_like "show resource", :tag
    it_should_behave_like "create resource", :tag
    it_should_behave_like "cannot update", :forbidden
    it_should_behave_like "cannot delete", :forbidden
  end
end
