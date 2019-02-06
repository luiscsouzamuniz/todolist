# frozen_string_literal: true

require 'rails_helper'

RSpec.describe TasksController, type: :request do
  before do
    @task1 = create(:task)
  end

  context '#create' do
    it 'POST tasks create' do
      post '/tasks.json', params: { task: { description: 'test json', status: :in_progress } }
      puts response.body
      expect(response.content_type).to eq('application/json')
      expect(response).to have_http_status(201)
    end

    it 'POST tasks fail' do
      post '/tasks.json', params: { task: { description: nil, status: :in_progress } }
      puts response.body
      expect(response.content_type).to eq('application/json')
      expect(response).to have_http_status(422)
    end
  end

  context '#index' do
    it 'GET index' do
      get '/tasks.json'
      puts JSON.parse(response.body, symbolize_names: true)
      expect(response.content_type).to eq('application/json')
      expect(response).to have_http_status(200)
    end
  end

  context '#destroy' do
    it 'destroy task successful' do
      expect { delete "/tasks/#{@task1.id}.json" }.to change { Task.count }.by(-1)
      expect(response).to have_http_status(204)
    end
  end

  context '#update' do
    it 'update success' do
      put "/tasks/#{@task1.id}.json", params: { task: { description: 'update test json', status: :completed } }
      puts JSON.parse(response.body)
      expect(response.content_type).to eq('application/json')
      expect(response).to have_http_status(200)
    end

    it 'update fail' do
      put "/tasks/#{@task1.id}.json", params: { task: { description: nil, status: nil } }
      puts JSON.parse(response.body)
      expect(response.content_type).to eq('application/json')
      expect(response).to have_http_status(422)
    end
  end
end
