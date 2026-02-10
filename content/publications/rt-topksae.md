---
title: "RT-TopKSAE: Improving Top-k Sparse Autoencoders with the Rotation Trick"
authors: ["Sulayman Yusuf", "A. Balwani"]
venue: "ICLR 2026 @ Geometric Representations and Mechanisms (GRaM) Workshop"
year: 2026
status: "under-review"
date: "2026-02-01"
arxiv: ""
pdf: ""
code: ""
abstract: "We present RT-TopKSAE, a novel approach to improving sparse autoencoders by incorporating the rotation trick from geometric deep learning. Our method addresses the challenge of preserving principal components in high-dimensional latent spaces while maintaining sparsity constraints. By applying rotation-equivariant transformations during training, we achieve a 40% improvement in principal component retention compared to standard Top-k sparse autoencoders, while maintaining comparable sparsity levels. Our approach uses custom PyTorch autograd functions to preserve gradients through the rotation operations, enabling end-to-end training. We demonstrate the effectiveness of RT-TopKSAE on several benchmark tasks in mechanistic interpretability, showing improved feature disentanglement and interpretability of learned representations."
tags: ["Sparse Autoencoders", "Geometric Deep Learning", "Mechanistic Interpretability", "Representation Learning"]
bibtex: "@inproceedings{yusuf2026rttopksae,
  title={RT-TopKSAE: Improving Top-k Sparse Autoencoders with the Rotation Trick},
  author={Yusuf, Sulayman and Balwani, A.},
  booktitle={ICLR 2026 Workshop on Geometric Representations and Mechanisms},
  year={2026}
}"
---

## Full Paper

This paper is currently under review at ICLR 2026 @ GRaM Workshop. Links to arXiv preprint, PDF, and code will be added upon publication.

## Abstract

We present RT-TopKSAE, a novel approach to improving sparse autoencoders by incorporating the rotation trick from geometric deep learning. Our method addresses the challenge of preserving principal components in high-dimensional latent spaces while maintaining sparsity constraints.

## Key Contributions

1. **Rotation-Equivariant Sparsity**: Novel method combining geometric transformations with Top-k sparsity constraints
2. **Gradient-Preserving Implementation**: Custom PyTorch autograd functions for end-to-end training
3. **Improved Interpretability**: 40% better principal component retention leading to more interpretable features
4. **Empirical Validation**: Comprehensive evaluation on mechanistic interpretability benchmarks

## Technical Innovation

The key insight is that applying rotation-equivariant transformations before sparsity constraints helps preserve the geometric structure of the latent space. This is particularly important for mechanistic interpretability, where understanding the directions of learned features is crucial.

## Results

- **40% improvement** in principal component retention
- **Comparable sparsity** to baseline Top-k SAE methods
- **Better feature disentanglement** on interpretability metrics
- **Scalable**: Works efficiently with latent dimensions up to 4096

## Impact

This work bridges geometric deep learning and mechanistic interpretability, showing how geometric principles can improve the interpretability of learned representations. The method is applicable to any sparse autoencoder architecture and has implications for understanding neural network internals.
