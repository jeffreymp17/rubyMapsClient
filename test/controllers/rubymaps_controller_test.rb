require 'test_helper'

class RubymapsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get rubymaps_index_url
    assert_response :success
  end

end
