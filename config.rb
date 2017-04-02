# Activate and configure extensions
# https://middlemanapp.com/advanced/configuration/#configuring-extensions

activate :autoprefixer do |prefix|
  prefix.browsers = "last 2 versions"
end

# Layouts
# https://middlemanapp.com/basics/layouts/

# Per-page layout changes
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false

# With alternative layout
# page '/path/to/file.html', layout: 'other_layout'

# Proxy pages
# https://middlemanapp.com/advanced/dynamic-pages/

# proxy(
#   '/this-page-has-no-template.html',
#   '/template-file.html',
#   locals: {
#     which_fake_page: 'Rendering a fake page with a local variable'
#   },
# )

# Helpers
# Methods defined in the helpers block are available in templates
# https://middlemanapp.com/basics/helper-methods/

# helpers do
#   def some_helper
#     'Helping'
#   end
# end



activate :deploy do |deploy|
  deploy.deploy_method = :rsync
  #deploy.user          = 'jackdesert'
  deploy.host          = 'jackdesert@jackdesert.webfactional.com'
  deploy.path          = '~/webapps/color'
  deploy.clean         = true # remove orphaned files on remote host, default: false

  # Optional Settings
  # deploy.port  = 5309 # ssh port, default: 22
  # deploy.flags = '-rltgoDvzO --no-p --del' # add custom flags, default: -avz
end

# Build-specific configuration
# https://middlemanapp.com/advanced/configuration/#environment-specific-settings
configure :build do
  activate :minify_css
  activate :minify_javascript

  # Append a hash to asset urls (make sure to use the url helpers)
  activate :asset_hash

  # activate :asset_host, :host => '//YOURDOMAIN.cloudfront.net'
end


#######################   I G N O R E D    F I L E S   #############################
#
# (Note middleman already knows not to build any file that starts with an underscore)
# but I don't like having underscores in the front of *some* of my filenames
# because it frustrates the alphabetical order
#
# Ignoring all included javascript files
ignore 'javascripts/chroma.js'
ignore 'javascripts/jquery-3.2.0.js'
ignore 'javascripts/semantic-sass-swatch.js'

# For some reason middleman does not ignore stylesheets when specifically instructed to do so
# Therefore reverting to underscores at beginning of stylesheets that should not be built

# Ignore swapfiles
ignore 'stylesheets/*.swp'






# Added this so asset pipeline woudl work
activate :sprockets






