Rails.application.routes.draw do
  get 'rubymaps/index'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
root 'location#index'

end
