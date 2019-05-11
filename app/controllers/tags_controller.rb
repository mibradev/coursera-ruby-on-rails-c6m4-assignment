class TagsController < ApplicationController
  wrap_parameters :tag, include: ["name"]
  before_action :set_tag, only: [:show, :update, :destroy]
  before_action :authenticate_user!, only: [:create, :update, :destroy]
  after_action :verify_authorized
  after_action :verify_policy_scoped, only: [:index]

  def index
    authorize Tag
    @tags = policy_scope(Tag.all)
  end

  def show
    authorize @tag
  end

  def create
    authorize Tag
    @tag = Tag.new(tag_params)

    if @tag.save
      render :show, status: :created, location: @tag
    else
      render json: { errors: @tag.errors.messages }, status: :unprocessable_entity
    end
  end

  def update
    authorize @tag

    if @tag.update(tag_params)
      head :no_content
    else
      render json: { errors: @tag.errors.messages }, status: :unprocessable_entity
    end
  end

  def destroy
    authorize @tag
    @tag.destroy
    head :no_content
  end

  private
    def set_tag
      @tag = Tag.find(params[:id])
    end

    def tag_params
      params.require(:tag).permit(:name)
    end
end
