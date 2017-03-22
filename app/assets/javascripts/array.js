var buildColorArray = function(parentDiv){

  var div = function(color, klass){
    console.log('div')
    return "<div class='" + klass + "' style='background-color: " + color + "'></div>"
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
      var lastDiv
      $parentDiv.append(div('black', 'main-color'))
      $lastDiv = $parentDiv.children().last()
      desaturates.map(function(desaturate){
        $lastDiv.append(div(desaturate, 'desaturate colored-box'))
      })
    })

  }


  var generateColorArray = function(){
    var bezInterpolator = chroma.bezier(['white', 'yellow', 'red', 'black'])
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

  }

  var generateShades = function(color){

  }



  generateGrid(parentDiv, colorArray)


}

$(document).ready(function(){
  buildColorArray('body')
})
