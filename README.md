# thumbnail-generator

Generate a thumbnail picture (1280 x 720) based on provided HTML.


# Demo example


### Input (HTML template):

Example HTML template (you can draft it with codesandbox.io): https://sjgsyl.csb.app/, and then, generate it like below (_**DISCLAIMER:** Please, note that the following link might not work or load slowly_):


```shell
https://thumbnail-generator.onrender.com/thumbnail?a
&templateUrl=https://sjgsyl.csb.app/
&title=Greetings from github.com
&leftPanelCopy=This is a left panel copy
```

### Output (image):

![](docs/example.png)
https://thumbnail-generator.onrender.com/thumbnail?templateUrl=https://sjgsyl.csb.app/%20&title=Greetings%20from%20github.com%20&leftPanelCopy=This%20is%20a%20left%20panel%20copy




# How to run

```shell
$ npm i
$ PORT=3000 npm start
```

# Render inline HTML

```shell
curl -d '{"html":"<h1>hey!</h1>"}' \
 -H "Content-Type: application/json" \
 -X POST http://localhost:3000/html --output test.jpg
```
