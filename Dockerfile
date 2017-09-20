FROM ubuntu:latest
MAINTAINER  Kouhei Morita <mrc0.py@gmail.com>

RUN apt-get update && apt-get upgrade -y
RUN apt-get -yq install build-essential language-pack-ja-base language-pack-ja
RUN apt-get install -qy \
    texlive-full \
    python-pygments gnuplot \
    make git
RUN apt-get -yq install biber && \
    apt-get -yq install locales dpkg wget wput curl zip tar rsync make
RUN wget https://github.com/jgm/pandoc/releases/download/1.19.2.1/pandoc-1.19.2.1-1-amd64.deb && \
    dpkg -i pandoc-1.19.2.1-1-amd64.deb
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash - && apt-get update && apt-get install -y nodejs
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
    apt-get update && apt-get install yarn
RUN apt-get install -y imagemagick

