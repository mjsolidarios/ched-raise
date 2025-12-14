# RAISE Visual Protocol Specification (v4.0)

**RAISE (Robust Anchored Indexed Symbol Encoding)** is a chromatic, grid-based visual data protocol for reliable short-payload transfer across cameras, screens, and embedded displays.

This document serves as the **implementation and decoding instructions** for developers.

---

## 1. Design Goals

* Robust against color noise, blur, and rotation
* Self-validating and versioned
* Low computational overhead
* Human-readable visual structure
* Extensible for future upgrades

---

## 2. Grid & Capacity

### Grid Configuration

* **Dimensions:** 8 × 8 grid
* **Total Cells:** 64
* **Anchor Cells:** 4 (corners)
* **Data Cells:** 60
* **Bits per Cell:** 2 bits (4 colors)
* **Raw Capacity:** 120 bits

### Logical Data Layout

| Field   | Size      | Description            |
| ------- | --------- | ---------------------- |
| Header  | 8 bits    | Version and flags      |
| Length  | 8 bits    | Payload length (bytes) |
| Payload | 0–96 bits | Encoded data           |
| ECC     | 8–16 bits | Error correction       |
| CRC     | 8 bits    | Final integrity check  |

---

## 3. Color Palette (4-ary Logic)

| Value | Bits | Name     | Hex       |
| ----- | ---- | -------- | --------- |
| 0     | `00` | Light    | `#f8fafc` |
| 1     | `01` | Teal     | `#10b77f` |
| 2     | `10` | Indigo   | `#08349f` |
| 3     | `11` | Midnight | `#020617` |

### Color Classification Rule

For each sampled pixel:

```
d² = (R - refR)² + (G - refG)² + (B - refB)²
```

Select the reference color with minimum distance.

**Confidence Score:**

```
confidence = 1 - (minDistance / secondMinDistance)
```

Cells with confidence below threshold (e.g. 0.15) are marked as **weak**.

---

## 4. Anchors & Orientation

### Anchor Layout

| Position     | Value | Meaning |
| ------------ | ----- | ------- |
| Top-Left     | `00`  | Origin  |
| Top-Right    | `01`  | X-axis  |
| Bottom-Left  | `10`  | Y-axis  |
| Bottom-Right | `11`  | Parity  |

### Orientation Resolution

Decoders must:

1. Sample corner cells
2. Test all 8 orientations (rotations + mirrors)
3. Select orientation with valid anchors and highest confidence

---

## 5. Header Format (8 bits)

```
Bits 0–2 : Protocol Version (001 = v4)
Bits 3–4 : ECC Mode
Bit 5    : Encoding Type (0 = ASCII, 1 = UTF-8)
Bits 6–7 : Reserved
```

---

## 6. Length Field (8 bits)

* Represents payload length in **bytes**
* Eliminates NULL termination
* Enables binary-safe payloads

---

## 7. Error Correction (ECC)

ECC operates on **2-bit symbols**, not individual bits.

| Mode         | Value | Description           |
| ------------ | ----- | --------------------- |
| None         | `00`  | No correction         |
| Parity       | `01`  | Row parity            |
| Hamming-lite | `10`  | Correct 1 symbol      |
| RS-lite      | `11`  | Multi-symbol recovery |

ECC bits are placed immediately before the CRC field.

---

## 8. CRC Validation

* **CRC-8** using polynomial `0x07`
* Applied to Header + Length + Payload + ECC
* Frames failing CRC are invalid

---

## 9. Grid Mapping Strategy

### Interleaved Fill Pattern

Rows alternate fill direction:

* Even rows: Left → Right
* Odd rows: Right → Left

Anchors are skipped during data placement.

This spreads localized errors and improves ECC effectiveness.

---

## 10. Encoding Instructions

### Encoding Steps

1. Encode payload according to header encoding
2. Write header byte
3. Write payload length byte
4. Append payload bytes
5. Generate ECC bits
6. Compute CRC-8
7. Convert full bitstream into 2-bit symbols
8. Map symbols into grid using interleaved pattern
9. Apply anchor colors

---

## 11. Decoding Instructions

### Decoding Pipeline

1. Locate grid and sample cell centers
2. Resolve orientation using anchors
3. Classify colors with confidence
4. Apply ECC recovery
5. Validate CRC
6. Extract header and length
7. Decode payload

Unrecoverable frames must return **INVALID**.

---

## 12. Sampling Geometry

For a detected scan area of size `S`:

* Cell width = `S / 8`
* Sample point:

```
X = startX + (col + 0.5) * cellWidth
Y = startY + (row + 0.5) * cellWidth
```

---

## 13. Optional Enhancements

### Temporal Redundancy

* Decode multiple frames
* Majority-vote each cell

### Visual Signature

* Reserve optional cells for branding or authentication

### Adaptive Palette

* Adjust color luminance relative to background
* Normalize using anchor samples

---

## 14. Security Notes

* CRC prevents accidental corruption
* Optional XOR payload masking
* Anchor-based normalization mitigates spoofing

---

## 15. Implementation Notes

* Avoid gamma-corrected color spaces when sampling
* Prefer linear RGB for distance calculations
* Cache reference color distances for performance

---

## 16. Versioning Policy

* Major versions change grid or palette
* Minor versions add optional fields
* Decoders must reject unknown major versions

---

## 17. Summary

RAISE v4.0 provides a **lightweight, robust, and extensible** visual data protocol suitable for:

* App-to-app linking
* IoT device pairing
* Offline authentication
* Educational and cultural artifacts
* Branded or cinematic visuals

---

**End of Specification**
