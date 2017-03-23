var buildColorArray = function(parentDiv){
  var sassDefinitions = ['# Sass Color Definitions', '']

  var div = function(color, klass, colorDefinition){
    var data = ''
    if (colorDefinition === undefined){
    }else{
      data = " data-color-definition='" + colorDefinition + "'"
    }
    return $("<div class='" + klass + "'" + data + " style='background-color: " + color + "'></div>")
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

  var writeColor = function(colorIndex, desaturateIndex, shadeOrTintIndex, color){
    var line
    var shadeOrTintValue = shadeOrTintIndex - 3
    var shadeOrTintLabel = 'shad'
    if (shadeOrTintValue < 0){
      shadeOrTintValue = Math.abs(shadeOrTintValue)
      shadeOrTintLabel = 'tint'
    }

    line = "$color-" + colorIndex + "-desat-" + desaturateIndex + "-" + shadeOrTintLabel + "-" + shadeOrTintValue + ": " + color + ";"
    console.log(line)
    sassDefinitions.push(line)
    return line
  }

  var generateGrid = function(parentDiv, colorArray){
    var $parentDiv = $(parentDiv)
    colorArray.forEach(function(color, colorIndex){
      var desaturates = generateDesaturates(color)
      var $mainColorDiv = div('black', 'main-color').appendTo($parentDiv)
      desaturates.forEach(function(desaturate, desaturateIndex){
        var shadesAndTints = generateShadesAndTints(desaturate)
        var $shadesAndTintsDiv = div('black', 'shades-and-tints').appendTo($mainColorDiv)
        shadesAndTints.forEach(function(shadeOrTint, shadeOrTintIndex){
          var definition = writeColor(colorIndex, desaturateIndex, shadeOrTintIndex, shadeOrTint)
          $shadesAndTintsDiv.append(div(shadeOrTint, 'colored-box', definition))
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

  var bindColorDefinitions = function(){
    $('div').on('click', function(event){
      var colorDefinition = event.target.dataset.colorDefinition
      $('.notice-box').text(colorDefinition)
      console.log(colorDefinition)
    })
  }


  var displaySassDefinitions = function(){
    var content = sassDefinitions.join("\n<br>\n")
    $('.sass-definitions').html(content)
  }



  generateGrid(parentDiv, colorArray)
  bindColorDefinitions()
  displaySassDefinitions()


}

$(document).ready(function(){
  buildColorArray('.colors-to-choose')
})
