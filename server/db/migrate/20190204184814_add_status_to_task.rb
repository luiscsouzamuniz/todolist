# frozen_string_literal: true

class AddStatusToTask < ActiveRecord::Migration[5.2]
  def change
    add_column :tasks, :status, :integer, default: 0
  end
end
