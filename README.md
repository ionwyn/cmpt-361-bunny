# CMPT 361 Assignment 2: Stanford Bunny

## Note
Please use a browser that supports ES6 JavaScript (i.e. no old IE)

## Features
- Left-lick and hold to move the bunny around.
- Scroll your mousewheel to translate the bunny along the Z axis
- Right-click and hold to rotate the bunny around.
- Auto-rotating light (stop the rotation by pressing 'p')
- Auto-panning spot-light (stop the panning by pressing 's')
- Reset bunny position by pressing 'r'
- Sloppy implementation of Blinn-Phong shading

## Acknowledgements

Thank you Red Bull, Starbucks Espresso, and these online resources:
- [Computer Graphics Lecture of Louisiana State University](https://csc.lsu.edu/~kooima/courses/csc4356/)
- [Geert Arien's Article on Blinn-Phong Shading](http://www.geertarien.com/blog/2017/08/30/blinn-phong-shading-using-webgl/)
- [Utility function for setting uniform 3 vector](https://kitware.github.io/vtk-js/api/Rendering_OpenGL_ShaderProgram.html)

Perhaps, the most notable acknowledgement goes to Geert Arien.  Despite giving a tutorial on Blinn-Phong lighting on a cube, his methods are applicable elsewhere (e.g. Stanford Bunny)

## Instructions

Clone, Run `index.html` on your favourite browser (except for IE).

## Shortcomings
Despite understanding the principles of Blinn-Phong Lighting, I still struggle to implement it.  There was a lot of trial and error being done for the vertex and fragment shader components.
I could have mess around with the values that make up the ambient, light, and surface colours.  But, I don't have enough time.
Also, being under serious time pressure, I decide to leave the project as it is.
