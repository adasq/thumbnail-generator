# thumbnail-generator

## render by HTML

```shell
curl -d '{"html":"<h1>hey!</h1>"}' \
 -H "Content-Type: application/json" \
 -X POST http://localhost:3000/html --output test.jpg
```