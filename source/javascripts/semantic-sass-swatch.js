
var renderTdElementsTransparent = function($parentElement){
  $parentElement.find('td').css('background-color', 'transparent')
}


var validColor = function(color){
  try{
    chroma(color)
    return true
  }catch(e){
    return false
  }
}

var distanceGivenTwoArrays = function(a, b){
  var sumOfSquares = 0
  a.forEach(function(valueA, index){
    var valueB = b[index]
    var difference = valueA - valueB
    sumOfSquares += Math.pow(difference, 2)
  })
  return Math.sqrt(sumOfSquares)
}

var lightnessFitsInRGB = function(color, proposedLightness){
  // Instead of doing the actual conversion to see if it fits in RGB,
  // we just check whether the color gets generated as we expect it.
  //
  // This works because chroma.js stores the color in RGB space. So if
  // it doesn't keep the qualities we assigned in LCH space, it's because
  // it didn't fit properly in RGB space
  //
  var originalHCL = chroma(color).hcl()

  // Clone
  var proposedHCL = [ originalHCL[0],
                      originalHCL[1],
                      proposedLightness ]

  var actualHCL = chroma.hcl(proposedHCL).hcl()
  // Only use lightness and chroma chroma to determine distance, since
  // hue (angle) may vary wildly for low-chroma colors suffering from 8-bit resolution
  var distance = distanceGivenTwoArrays(proposedHCL.slice(1, 2), actualHCL.slice(1, 2))

  // We use a distance of 1 as our line in the sand, since if we choose the closest (R, G, B)
  // we will be within a distance of 1 from the value we wanted, even with 8-bit RGB.
  return (distance < 1)
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



var generateSwatches = function(){

  var sassDefinitionsOriginal = ['// Generated using http://semantic-sass-swatch.com',
                                 '//',
                                 '// SASS Variable         RGB Value    // CIELCh Values',
                                 '//']
  var sassDefinitions

  var generateDownloadLink = function(){
    // Source: http://stackoverflow.com/questions/31656782/create-big-downloable-file-from-string-variable-in-html-javascript
    var linkKlass = 'link_download'
    var createObjectURL = (window.URL || window.webkitURL || {}).createObjectURL || function(){}
    var blob = null
    var content
    var mimeString = "application/octet-stream"
    var joiner = "\n"
    if (navigator.platform == 'Win32'){
      joiner = "\r\n"
    }
    content = sassDefinitions.join(joiner)
    window.BlobBuilder = window.BlobBuilder ||
                         window.WebKitBlobBuilder ||
                         window.MozBlobBuilder ||
                         window.MSBlobBuilder


    if(window.BlobBuilder){
       var bb = new BlobBuilder()
       bb.append(content)
       blob = bb.getBlob(mimeString)
    }else{
       blob = new Blob([content], {type : mimeString})
    }
    var url = createObjectURL(blob)
    var a = document.createElement("a")
    a.href = url
    a.download = "semantic-sass-swatch.com.scss"
    a.innerHTML = "Generate SASS File"

    // Remove existing download links from page
    $('.' + linkKlass).remove()
    $(a).addClass(linkKlass)
    $('#download-link-holder').append(a)
  }

  var resetSassDefinitions = function(){
    // Clone
    sassDefinitions = JSON.parse(JSON.stringify(sassDefinitionsOriginal))
  }

  var writeArbitraryLine = function(text){
    sassDefinitions.push(text)
  }

  var writeColor = function(colorIndex, desaturateIndex, shadeOrTintIndex, color){
    var lch = chroma(color).lch()
    var L = lch[0].toPrecision(3)
    var C = lch[1].toPrecision(3)
    var H = lch[2].toPrecision(3)
    var lchString = 'L: ' + L + '  C: ' + C + '  H: ' + H

    var line
    var shadeOrTintValue = shadeOrTintIndex - 2
    var shadeOrTintLabel = 'shad'
    if (shadeOrTintValue <= 0){
      shadeOrTintValue = Math.abs(shadeOrTintValue)
      shadeOrTintLabel = 'tint'
    }

    line = "$color-" + colorIndex + "-desat-" + desaturateIndex + "-" + shadeOrTintLabel + "-" + shadeOrTintValue + ": " + color + ";     // " + lchString
    //console.log(line)
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

    var $noticeBox = $('.notice-box')
    var $table = $('.swatch__table-holder')
    var tile = '.color-swatch__tile'

    $table.on('mouseover', tile, function(event){
      var colorDefinition = event.target.dataset.colorDefinition
      $noticeBox.show()
      $noticeBox.text(colorDefinition)
    })

    $table.on('mouseout', tile, function(event){
      $noticeBox.hide()
    })


  }

  var displaySassDefinitions = function(){
    var content = sassDefinitions.join("\n")
    $('.sass-definitions').html(content)
  }

  var bindOneMoreColor = function(){
    var effectDuration = 250

    var oneMoreColor = function(){
      var numSwatches = $('.swatch').length
      var $swatchName, name, nameArray, id
      var $lastSwatch = $('.swatch').last()
      var html = "<div class='swatch'>" + $lastSwatch.html() + "</div>"
      var $newSwatch = $(html).insertAfter($lastSwatch)
      renderTdElementsTransparent($newSwatch)
      $newSwatch.hide()
      $newSwatch.slideDown(effectDuration, 'linear')
      $newSwatch.find('.swatch__color-input').val('')
      $newSwatch.find('.swatch__name').text('color-' + numSwatches)


    }

    $('#one-more-color').on('click', function(){
      oneMoreColor()
    })
  }

  var generateTableForColor = function(color, colorIndex){
    var tintArray = ['tint-2', 'tint-1', 'tint-0', 'shad-1', 'shad-2']
    var hexColor
    var cellKlass
    var sassDefinition
    var tintOrShade

    var desaturates = generateDesaturates(color)
    var allTheColors = []
    desaturates.forEach(function(desaturate, index){
      allTheColors.push(verticalSlice(desaturate))
    })

    var table = "<table class='color-swatch'>\n"
    writeArbitraryLine('// Based on Color ' + color)

    table += "<tr>"
    for (var col=0; col<5; col++){
      table += "<td class='color-swatch__label-holder'>\n"
      if(colorIndex === 0){
        table += "  <div class='color-swatch__label_desat'>desat-" + col + "</div>\n"
      }
      //table += "  <div class='color-swatch__label_chroma'>(C: " + Math.round(allTheColors[col][0].chroma) + ")</div>\n"
      table += "</td>"
    }
    table += "</tr>"
    for (var row=0; row<5; row++){


      table += "<tr>\n"
      for (col=0; col<5; col++){
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
      table += "<td class='color-swatch__label'>\n"
      table += "  <div class='color-swatch__label_tint'>" + tintArray[row] + "</div>\n"
      //table += "  <div class='color-swatch__label_lightness'>(L: " + Math.round(allTheColors[0][row].targetLightness) + ")</div>\n"
      table += "</tr>\n"
    }
    table += "</table>\n"
    writeArbitraryLine('')
    return table
  }

  var runEachColor = function(){
    resetSassDefinitions()
    var $colorInputs = $('.swatch__color-input')

    $colorInputs.each(function(colorIndex){
      var $parentDiv = $(this).parents('.swatch')
      var color = $(this).val()
      var tableHtml
      if (validColor(color)){
        tableHtml = generateTableForColor(color, colorIndex)
        $parentDiv.find('.swatch__table-holder').html(tableHtml)
      }else{
        renderTdElementsTransparent($parentDiv)
      }
    })

    generateDownloadLink()
  }

  $('#swatches').on('input', '.swatch__color-input', function(){
    console.log('running!')
    runEachColor()
  })

  runEachColor()

  bindColorDefinitions()

  bindOneMoreColor()

}
