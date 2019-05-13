class Tag < ActiveRecord::Base
  include Protectable

  has_and_belongs_to_many :things

  validates :name, presence: true
  validates :name, uniqueness: true
end
