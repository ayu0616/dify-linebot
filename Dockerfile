FROM denoland/deno:latest

WORKDIR /app

COPY . .

RUN deno task build

EXPOSE 8000

CMD ["/bin/sh","-c", "deno task preview"]
