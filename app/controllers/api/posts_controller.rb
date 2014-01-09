class Api::PostsController < ApplicationController
  before_filter :validate_token

  POSTS = [
    { id: 1, title: 'Foo', body: 'Bar' },
    { id: 2, title: 'Foo 2', body: 'Bar 2' },
  ]

  def index
    render json: POSTS, root: false
  end

  private

  def validate_token
    begin
      token = request.headers['Authorization'].split(' ').last
      logger.debug token
      JWT.decode(token, 'secret')
    rescue
      render nothing: true, status: :unauthorized
    end
  end
end
