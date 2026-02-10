---
title: "Equivariant VAE for Video Generation"
description: "End-to-end ML pipeline for video generation using equivariant variational autoencoders with modular architecture and automated monitoring"
date: "2025-01-15"
tags: ["PyTorch", "Python", "FastAPI", "Docker", "AWS", "VAE", "Geometric Deep Learning"]
github: "https://github.com/xyro-coder/equivariant-vae"
demo: ""
writeup: ""
image: "/images/projects/equivariant-vae.png"
featured: true
---

## Overview

Built an end-to-end machine learning pipeline for video generation using equivariant variational autoencoders (VAEs), implementing geometric deep learning principles to preserve symmetries in video data.

## Key Features

- **Modular ML Pipeline**: Implemented using PyTorch Lightning with configurable data loaders and architecture support
- **Equivariant Architecture**: Designed VAE layers that respect SO(3) rotational symmetries in video frames
- **Automated Monitoring**: Built-in experiment tracking and performance metrics using TensorBoard and MLflow
- **Production Deployment**: FastAPI-based inference service deployed on AWS infrastructure
- **Performance Optimization**: Achieved 7× inference speed improvement through model quantization and batching

## Technical Details

### Architecture

The equivariant VAE uses group-convolutional layers to maintain rotational equivariance throughout the encoding and decoding process. This allows the model to generalize better across different orientations of objects in video frames.

### Infrastructure

- **Training**: PyTorch Lightning on multi-GPU setup with distributed data parallel
- **Inference**: FastAPI microservice with async request handling
- **Deployment**: Docker containers orchestrated on AWS ECS
- **Monitoring**: Real-time metrics dashboard with Grafana

### Performance

- 7× faster inference compared to baseline implementation
- 40% reduction in model parameters through architectural improvements
- Maintained comparable reconstruction quality (PSNR: 28.5 dB)

## Impact

This project demonstrates the practical application of geometric deep learning principles in production ML systems, combining theoretical rigor with engineering best practices for scalable, maintainable code.
