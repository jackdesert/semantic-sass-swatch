var generateVersion2 = function(parentDiv){
  var sassDefinitions = ['# Sass Variable          RGB(hex)        CIELCh',
                         '#                                        L    C    H',
                         '#']

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
    var lch = chroma(color).lch()
    var l = lch[0].toPrecision(3)
    var c = lch[1].toPrecision(3)
    var h = lch[2].toPrecision(3)
    var lchString = [l, c, h].join(" ")

    var line
    var shadeOrTintValue = shadeOrTintIndex - 3
    var shadeOrTintLabel = 'shad'
    if (shadeOrTintValue < 0){
      shadeOrTintValue = Math.abs(shadeOrTintValue)
      shadeOrTintLabel = 'tint'
    }

    line = "$color-" + colorIndex + "-desat-" + desaturateIndex + "-" + shadeOrTintLabel + "-" + shadeOrTintValue + ": " + color + ";     // " + lchString
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
    var desaturate, bezInterpolator
    var targetChroma = 5
    var lch = chroma(color).lch()
    lch[1] = targetChroma
    desaturate = chroma.lch(lch).hex()

    // var targetLuminance = chroma(color).luminance()
    // var desaturate = chroma('grey').luminance(targetLuminance)
    //bezInterpolator = chroma.bezier([color, desaturate])
    return chroma.scale([color, desaturate]).colors(5)
  }

  var generateTints = function(color){
    var bezInterpolator, colors, lightestTint

    var lightestTintLch = chroma(color).lch()
    lightestTintLch[0] = 95

    lightestTint = chroma.lch(lightestTintLch)

    //bezInterpolator = chroma.bezier([lightestTint, color])
    colors = chroma.scale([lightestTint, color]).colors(5)
    return colors
  }

  var generateShades = function(color){
    var bezInterpolator, colors, darkestShade

    var darkestShadeLch = chroma(color).lch()
    darkestShadeLch[0] = 5

    darkestShade = chroma.lch(darkestShadeLch)

    //bezInterpolator = chroma.bezier([color, darkestShade])
    colors = chroma.scale([color, darkestShade]).colors(5)
    //colors.pop()
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
    var content = sassDefinitions.join("\n")
    $('.sass-definitions').html(content)
  }


  var getColors = function(){
    return [$('#color_1').val(), $('#color_2').val()]
  }

  generateGrid(parentDiv, getColors())
  bindColorDefinitions()
  displaySassDefinitions()


}
