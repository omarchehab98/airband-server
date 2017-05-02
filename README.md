# airband-server

[![Build Status][build-badge]][build] [![Standard code style][standard-badge]][standard] [![License][license-badge]][license]

[build]: https://travis-ci.org/omarchehab98/airband-server

[build-badge]: https://travis-ci.org/omarchehab98/airband-server.svg?branch=master

[standard]: https://standardjs.com

[standard-badge]: https://img.shields.io/badge/code_style-standard-brightgreen.svg

[license]: ./LICENSE

[license-badge]: https://img.shields.io/github/license/omarchehab98/airband-server.svg

Airband is our hackathon submission for WearHacks Kitchener 2017.

## Inspiration
We wanted to bring the pure ecstasy and adrenaline one gets when jamming out on their favourite instrument to a augmented reality environment. The unbeatable pleasure of creating music and art is no longer only exclusive to experienced musicians.

## What it does
Through hand motions gestures, our hack simulates playing instruments in an augmented reality environment. You can play the piano, drums and bongos to rock out all by yourself or with friends or challenge others in a head to head battle.

## How we built it
Using leap motions hand tracking sensors and Unity's physics engine, we created a collision detection system with virtual instruments which relays each note to a back-end server. Using node.js, we built a event-driven system which dynamically responds, receives and relays data to the clients using our back end server.

[Read more on our DevPost](https://devpost.com/software/airband-p5og0a)
