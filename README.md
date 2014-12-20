staves
======

Create pdfs from `.staves` notations with just a command line execution:

```bash
$ staves your-notation.staves
```

Heavily inspired (and making use of) [0xfe/vextab](https://github.com/0xfe/vextab) with a simplified file format for easier typesetting of songs *with text* below their notes. The main use case is to create pdf slides of songs (e.g. for being sung at a church service).

Getting started
---------------

```
$ (sudo) npm install -g staves
$ staves --help
  Usage: staves [options] <file.staves>

  Options:

    -h, --help                             output usage information
    -V, --version                          output the version number
    -w <n > 0>, --width <n > 0>            the width of the pdf file to create (in px), defaults to 1024
    -h <n > 0>, --height <n > 0>           the height of the pdf file to create (in px), defaults to 800
    -o <file.pdf>, --outfile <file.pdf>    the target pdf file, defaults to a.pdf
    -t <-11..+11>, --transpose <-11..+11>  transpose the content of <file.staves> by -11 to +11 semitones, defaults to 0
```

License
-------

```
The MIT License (MIT)

Copyright (c) 2014 Dominik Schreiber

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

(see [LICENSE](LICENSE))