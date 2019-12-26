# Node.js Image Proxy Server

### When to use

The server is meant to act as a proxy for serving image files from a (slow) storage like S3. It handles resizing images with [Sharp](https://github.com/lovell/sharp) and additionally caches modified images on disk. Subsequent requests to the same image will then be served straight from the cache.

The available parameters to modify an image are:
- height
- width
- quality

A sample request to the server could look like this:
`http://localhost:3000/height=150/width=300/quality=90/my_image.jpg`

Note that the order of the parameters does not matter.

### Configuration

The server requires a `.env` file with the following environment variables:
- `MASTER_SERVER_URL` is the URL that points to the storage where the original images are available
- `CACHE_DIR` is the directory that should be used for caching modified images

A sample `.env` file could look like this:
```
MASTER_SERVER_URL=http://s3.eu-central-1.amazonaws.com/<my_bucket>
CACHE_DIR=./generated
```

### Note

The server currently only supports jpg-images. :)
