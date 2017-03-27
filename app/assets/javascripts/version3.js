var lightnessFitsInRGB = function(color, proposedLightness){
  // Given a color, can the lightness be changed to newLightness and the color
  // still exist in RGB space?
  var originalHCL = chroma(color).hcl()

  // Clone
  var newHCL = [ originalHCL[0],
                 originalHCL[1],
                 proposedLightness ]

  var actualLightness = chroma.hcl(newHCL).hcl()[2]
  var diffLightness = actualLightness - proposedLightness

  return (Math.abs(diffLightness) < 1)
}

var changeLightness = function(color, newLightness){
  var hcl = chroma(color).hcl()

  if (!lightnessFitsInRGB(color, newLightness)){
    // return null if new color does not fit in RGB
    return null
  }

  hcl[2] = newLightness

  // otherwise return new color
  return chroma.hcl(hcl).hex()
}


var lightnessDomain = function(color){
  var originalLightness = chroma(color).hcl()[2]
  var domain = []
  for (var l = 0; l < 101; l++){
    if (lightnessFitsInRGB(color, l)){
      domain.push(l)
    }
  }
  return [domain.unshift(), domain.pop()]
}

var verticalSlice = function(color){
  // N is the array dimension
  // N must be odd
  var N = 5
  var hcl = chroma(color).hcl()
  var originalLightness = hcl[2]
  var c = hcl[1]
  var maxLightness = 95
  var minLightness = 5
  var lightnessRange = [maxLightness,
                        (maxLightness + originalLightness)/2,
                        originalLightness,
                        (originalLightness + minLightness)/2,
                        minLightness]
  var lightness
  var cellColor
  var output = []
  for (var index=0; index<N; index++){
    targetLightness = lightnessRange[index]
    output.push({
                  hexColor:        changeLightness(color, targetLightness),
                  targetLightness: targetLightness,
                  chroma:          c
                })
  }

  return output
}



var generateVersion3 = function(parentDiv){
  var sassDefinitions = ['// Sass Variable         RGB(hex)     // HCL values from CIELCh',
                         '//                                    //']


  var writeArbitraryLine = function(text){
    sassDefinitions.push(text)
  }

  var writeColor = function(colorIndex, desaturateIndex, shadeOrTintIndex, color){
    var lch = chroma(color).lch()
    var L = lch[0].toPrecision(3)
    var C = lch[1].toPrecision(3)
    var H = lch[2].toPrecision(3)
    var lchString = 'H: ' + H + '  C: ' + C + '  L: ' + L

    var line
    var shadeOrTintValue = shadeOrTintIndex - 2
    var shadeOrTintLabel = 'shad'
    if (shadeOrTintValue <= 0){
      shadeOrTintValue = Math.abs(shadeOrTintValue)
      shadeOrTintLabel = 'tint'
    }

    line = "$color-" + colorIndex + "-desat-" + desaturateIndex + "-" + shadeOrTintLabel + "-" + shadeOrTintValue + ": " + color + ";     // " + lchString
    console.log(line)
    sassDefinitions.push(line)
    return line
  }


  var generateDesaturates = function(color){
    var desaturate, bezInterpolator
    var targetChroma = 5
    var lch = chroma(color).lch()
    lch[1] = targetChroma
    desaturate = chroma.lch(lch).hex()

    // var targetLightness = chroma(color).luminance()
    // var desaturate = chroma('grey').luminance(targetLightness)
    //bezInterpolator = chroma.bezier([color, desaturate])
    return chroma.scale([color, desaturate]).colors(5)
  }

  var bindColorDefinitions = function(){
    var $tile = $('.color-swatch__tile')

    $tile.on('mouseover', function(event){
      var colorDefinition = event.target.dataset.colorDefinition
      $('.notice-box').text(colorDefinition)
    })



  }

  var displaySassDefinitions = function(){
    var content = sassDefinitions.join("\n")
    $('.sass-definitions').html(content)
  }

  var getColors = function(){
    return [$('#color_1').val(), $('#color_2').val()]
  }


  var generateTableForColor = function(color, colorIndex){
    var hexColor
    var cellKlass
    var sassDefinition

    var desaturates = generateDesaturates(color)
    var allTheColors = []
    desaturates.forEach(function(desaturate, index){
      allTheColors.push(verticalSlice(desaturate))
    })

    var table = "<table class='color-swatch'>\n"
    writeArbitraryLine('// Based on Color ' + color)

    table += "<tr>"
    for (var col=0; col<5; col++){
      table += "<td class='color-swatch__label'>C: " + Math.round(allTheColors[col][0].chroma) + "</td>"
    }
    table += "</tr>"
    for (var row=0; row<5; row++){


      table += "<tr>\n"
      for (var col=0; col<5; col++){
        hexColor = allTheColors[col][row].hexColor
        cellKlass = ''
        sassDefinition = ''
        data = ''
        if(hexColor !== null){
          cellKlass = 'color-swatch__tile'
          sassDefinition = writeColor(colorIndex, col, row, hexColor)
          data = " data-color-definition='" + sassDefinition + "'"
        }
        table += "<td class='" + cellKlass + "' style='background-color: " + hexColor  + "'" + data +"></td>\n"
      }
      table += "<td class='color-swatch__label'>L: " + Math.round(allTheColors[0][row].targetLightness) + "</td>\n"
      table += "</tr>\n"
    }
    table += "</table>\n"
    writeArbitraryLine('')
    $('.colors-to-choose').append(table)
  }

  colors = getColors()
  colors.forEach(function(color, colorIndex){
    generateTableForColor(color, colorIndex)
  })
  bindColorDefinitions()

  displaySassDefinitions()


}
