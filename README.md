# Image Forwarder

API that takes a link to an image file and relays the data such that the end user cannont be logged by the origin server

## API Reference

#### Get an image

```http
  GET /image?url=${url}
```

| Parameter | Type     | Description                                |
| :-------- | :------- | :----------------------------------------- |
| `url`     | `string` | **Required**. The direct link to the image |

## Run Locally

Clone the project

```bash
  git clone https://github.com/addi00000/image-forwarder
```

Go to the project directory

```bash
  cd image-forwarder
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```

## Demo

![](https://i.imgur.com/WIV6FwO.gif)
