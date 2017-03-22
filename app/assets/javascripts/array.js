var buildColorArray = function(parentDiv){

  var div = function(color, klass){
    return $("<div class='" + klass + "' style='background-color: " + color + "'></div>")
  }

//  var generateDivs = function(parentDiv, colorArray){
//    var coloredBox = function(color){
//      return "<div class='colored-box' style='background-color: " + item + "'></div>"
//    }
//
//    var $parentDiv = $(parentDiv)
//    colorArray.map(function(item){
//      $parentDiv.append(coloredBox(item))
//    })
//
//  }

  var generateGrid = function(parentDiv, colorArray){
    var $parentDiv = $(parentDiv)
    colorArray.map(function(color){
      var desaturates = generateDesaturates(color)
      var $mainColorDiv = div('black', 'main-color').appendTo($parentDiv)
      desaturates.map(function(desaturate){
        console.log(desaturate)
        var shadesAndTints = generateShadesAndTints(desaturate)
        var $shadesAndTintsDiv = div('black', 'shades-and-tints').appendTo($mainColorDiv)
        shadesAndTints.map(function(shadeOrTint){
          $shadesAndTintsDiv.append(div(shadeOrTint, 'colored-box'))
        })
      })
    })

  }


  var generateColorArray = function(){
    var bezInterpolator = chroma.bezier(['red', 'orange', 'yellow', 'green'])
    return bezInterpolator.scale().colors(4)
  }

  var colorArray = generateColorArray()

  var generateDesaturates = function(color){
    var targetLuminance = chroma(color).luminance()
    var desaturate = chroma('grey').luminance(targetLuminance)
    var bezInterpolator = chroma.bezier([color, desaturate])
    return bezInterpolator.scale().colors(5)
  }

  var generateTints = function(color){
    var bezInterpolator = chroma.bezier([color, 'white'])
    var colors = bezInterpolator.scale().colors(5)
    colors.pop()
    return colors.reverse()
  }

  var generateShades = function(color){
    var bezInterpolator = chroma.bezier([color, 'black'])
    colors = bezInterpolator.scale().colors(5)
    colors.pop()
    colors.shift()
    return colors
  }

  var generateShadesAndTints = function(color){
    return generateTints(color).concat(generateShades(color))
  }




  generateGrid(parentDiv, colorArray)


}

$(document).ready(function(){
  buildColorArray('body')
})
