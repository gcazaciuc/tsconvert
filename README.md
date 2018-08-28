# CSS/SASS to Typestyle converter ( tsconvert )

A command line utility taking into regular CSS styles or SASS files and generating, for each one, a corresponding style file but with Typestyle as the underlying library.

## Install

You can install it locally to your project( and it will be available in `node_modules/.bin/tsconvert`)

```sh
npm i tsconvert
```

Or globally:

```sh
npm i -g tsconvert
```

## Usage

After you have installed it a command line utility named `tsconvert` will be available from your terminal.

The command line accepts 3 parameters:

```sh
    tsconvert -f dir -ext css,scss --overwrite
```

ALL parameters are **optional**.

The meaning of the params and their default value is:

- `-f` - Designated a directory name or a full file path to process. If a directory it searches recursively for all files having the designated extensions and converts them into Typestyle. Defaults to `process.cwd()`.

- `-ext` - A list of file extensions to process. Defaults to `css,scss`.

- `-overwrite` - If the target output file(Typestyle file) exists already and this flag is set to true it will overwrite. Otherwise no. Defaults to `false`.

## How it works
Sass files are compiled to regular CSS with Node-Sass prior to being transformed into Typestyle.
For each CSS rule it will try to generate a *class name*, so the resulting CSS might not be functionally equivalent to the input CSS.

The name of the class being generated is composed by stringing together the selectors of the rule and camel casing everything.

Example

```css
.btn {
    font-size: 20px;
}
.btn:hover {
    font-size: 60px;
}

a button {
    font-size: 40px;
}

#main {
    background-color: blue;
}
```

After running the utility it will generate 3 classes:

```js
export const btn = style({ fontSize:'20px', 
                            $nest: { '&:hover': 
                                { fontSize: '60px' } 
                            } 
                        });
export const aButton = style({ fontSize:'40px' });
export const main = style({ backgroundColor: 'blue' });
```

The you can import and apply these classes as you see fit