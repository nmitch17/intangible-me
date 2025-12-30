'use client';

import { useState, useMemo, useCallback } from 'react';
import type { ChartData, CenterName, SelectedElement } from '@/types';
import {
  ALL_CHANNELS,
  type ChannelDefinition,
} from '@/lib/bodygraph/layout';
import { GATE_CENTERS } from '@/lib/calculation/mandala';

interface Bodygraph2DProps {
  chartData: ChartData;
  onElementSelect: (element: SelectedElement | null) => void;
  selectedElement: SelectedElement | null;
}

// Center positions based on the provided SVG (viewBox 0 0 306 511)
const CENTER_2D_POSITIONS: Record<CenterName, { x: number; y: number }> = {
  head: { x: 153, y: 35 },
  ajna: { x: 153, y: 107 },
  throat: { x: 153, y: 191 },
  g: { x: 153, y: 280 },
  ego: { x: 225, y: 322 },
  spleen: { x: 36, y: 390 },
  sacral: { x: 153, y: 395 },
  solar_plexus: { x: 274, y: 390 },
  root: { x: 153, y: 478 },
};

// Exact SVG paths for center shapes from the provided design
const CENTER_PATHS: Record<CenterName, string> = {
  head: "M149.193 4.85633C151.145 2.34927 154.924 2.30609 156.938 4.76396C175.344 27.2246 182.563 39.0991 188.691 55.5101C190.494 60.3401 187.077 65.475 181.934 65.8469C160.859 67.3712 145.732 67.3808 124.804 65.8963C119.433 65.5154 116.033 59.9819 118.185 55.047C126.672 35.5924 133.976 24.3945 149.193 4.85633Z",
  ajna: "M149.193 138.144C151.145 140.651 154.924 140.694 156.938 138.236C175.344 115.775 182.563 103.901 188.691 87.4899C190.494 82.6599 187.077 77.525 181.934 77.1531C160.859 75.6288 145.732 75.6192 124.804 77.1037C119.433 77.4846 116.033 83.0181 118.185 87.953C126.672 107.408 133.976 118.606 149.193 138.144Z",
  throat: "M121.285 168.595C121.144 163.953 124.951 160.147 129.593 160.295C146.713 160.843 159.366 160.957 176.364 160.352C181.022 160.186 184.87 163.982 184.745 168.641C184.278 185.948 184.256 198.336 184.729 215.3C184.86 219.981 180.984 223.793 176.304 223.6C159.276 222.897 146.906 222.93 129.706 223.618C125.023 223.805 121.157 219.977 121.304 215.292C121.834 198.316 121.809 185.924 121.285 168.595Z",
  g: "M114.279 285.816C110.897 282.632 110.898 277.249 114.285 274.072C126.778 262.354 135.805 253.487 147.397 241.04C150.573 237.629 155.979 237.592 159.185 240.975C171.093 253.543 179.836 262.318 192.166 273.979C195.569 277.197 195.523 282.633 192.078 285.805C179.54 297.349 170.816 306.119 159.141 318.768C155.962 322.212 150.521 322.238 147.312 318.822C135.683 306.444 126.903 297.699 114.279 285.816Z",
  ego: "M225.655 300.871C213.719 309.453 206.935 316.777 199.72 327.982C197.414 331.563 199.018 336.332 202.994 337.859C218.237 343.712 229.305 346.138 245.196 344.499C249.18 344.088 251.817 340.223 250.808 336.347C247.437 323.402 243.135 314.472 235.133 302.594C233.017 299.452 228.73 298.66 225.655 300.871Z",
  spleen: "M62.1437 393.807C64.6507 391.855 64.6939 388.076 62.236 386.062C39.7754 367.656 27.9009 360.437 11.4899 354.309C6.65993 352.506 1.52503 355.923 1.15311 361.066C-0.371198 382.141 -0.380781 397.268 1.10368 418.196C1.48462 423.567 7.01813 426.967 11.953 424.815C31.4076 416.328 42.6055 409.024 62.1437 393.807Z",
  sacral: "M121.285 372.595C121.144 367.953 124.951 364.147 129.593 364.295C146.713 364.843 159.366 364.957 176.364 364.352C181.022 364.186 184.87 367.982 184.745 372.641C184.278 389.948 184.256 402.336 184.729 419.3C184.86 423.981 180.984 427.793 176.304 427.6C159.276 426.897 146.906 426.93 129.706 427.618C125.023 427.805 121.157 423.977 121.304 419.292C121.834 402.316 121.809 389.924 121.285 372.595Z",
  solar_plexus: "M243.856 393.807C241.349 391.855 241.306 388.076 243.764 386.062C266.225 367.656 278.099 360.437 294.51 354.309C299.34 352.506 304.475 355.923 304.847 361.066C306.371 382.141 306.381 397.268 304.896 418.196C304.515 423.567 298.982 426.967 294.047 424.815C274.592 416.328 263.394 409.024 243.856 393.807Z",
  root: "M121.285 455.595C121.144 450.953 124.951 447.147 129.593 447.295C146.713 447.843 159.366 447.957 176.364 447.352C181.022 447.186 184.87 450.982 184.745 455.641C184.278 472.948 184.256 485.336 184.729 502.3C184.86 506.981 180.984 510.793 176.304 510.6C159.276 509.897 146.906 509.93 129.706 510.618C125.023 510.805 121.157 506.977 121.304 502.292C121.834 485.316 121.809 472.924 121.285 455.595Z",
};

// Channel paths from the provided SVG design
// Format: [gates, path, isVertical] - vertical channels use the triple-line pattern
interface ChannelPath {
  gates: [number, number];
  paths: string[]; // Array of paths (some channels have multiple lines)
}

const CHANNEL_PATHS: ChannelPath[] = [
  // Head to Ajna (3 vertical lines)
  { gates: [64, 47], paths: ["M138.5 66.5V76.5"] },
  { gates: [61, 24], paths: ["M153.5 66.5V76.5"] },
  { gates: [63, 4], paths: ["M168.5 66.5V76.5"] },
  // Ajna to Throat (3 vertical lines)
  { gates: [17, 62], paths: ["M138.5 116.5V162"] },
  { gates: [43, 23], paths: ["M153.5 116.5V162"] },
  { gates: [11, 56], paths: ["M168.5 116.5V162"] },
  // Throat to G (3 vertical lines)
  { gates: [31, 7], paths: ["M138.5 216.5V262"] },
  { gates: [8, 1], paths: ["M153.5 216.5V262"] },
  { gates: [33, 13], paths: ["M168.5 216.5V262"] },
  // G to Sacral (3 vertical lines)
  { gates: [15, 5], paths: ["M138.5 302V368"] },
  { gates: [2, 14], paths: ["M153.5 302V368"] },
  { gates: [46, 29], paths: ["M168.5 302V368"] },
  // Sacral to Root (3 vertical lines)
  { gates: [42, 53], paths: ["M138.5 426V449"] },
  { gates: [3, 60], paths: ["M153.5 426V449"] },
  { gates: [9, 52], paths: ["M168.5 426V449"] },
  // Solar Plexus to Root (3 curved lines on right)
  { gates: [49, 19], paths: ["M263.5 402.5C246.921 443.717 227.84 456.568 180 465"] },
  { gates: [55, 39], paths: ["M281.5 402.5C261.446 453.28 238.366 469.112 180.5 479.5"] },
  { gates: [30, 41], paths: ["M293 416C270.563 469.418 244.741 486.072 180 497"] },
  // Spleen to Root (3 curved lines on left)
  { gates: [32, 54], paths: ["M42.5 402.5C59.0793 443.717 78.1603 456.568 126 465"] },
  { gates: [28, 38], paths: ["M24.5 402.5C44.554 453.28 67.6341 469.112 125.5 479.5"] },
  { gates: [18, 58], paths: ["M13 416C35.4366 469.418 61.2589 486.072 126 497"] },
  // Ego to Solar Plexus
  { gates: [40, 37], paths: ["M246.5 338.5C260.5 347.5 266.5 361 266.5 374"] },
  // Ego to Sacral area
  { gates: [26, 44], paths: ["M247 390.5C230.5 403 203 409.5 180.5 406.5"] },
  // Spleen connections
  { gates: [57, 20], paths: ["M59.5 390.5C76 403 103.5 409.5 126 406.5"] },
  // G to Ego
  { gates: [25, 51], paths: ["M191.5 284.5C204.781 290.509 210.667 295.65 217.5 309"] },
  // Throat to Solar Plexus
  { gates: [12, 22], paths: ["M182 211.5C200.5 224.5 226 272.5 229 302"] },
  { gates: [35, 36], paths: ["M182 199.5C225 211 273.5 294.5 281 363"] },
  // Throat to Spleen (integration channels)
  { gates: [20, 34], paths: ["M125 199.5C96.5882 207.099 64.8006 246.631 45 292M26 363C27.669 347.757 34.0478 321.77 39.265 306M45 292C53.0868 275 86.6016 275.314 115.5 278.5M45 292C41.502 300.015 42.0017 297.728 39.265 306M39.265 306C33.7575 325 77.8181 376.484 125 384.5"] },
  { gates: [16, 48], paths: ["M182 181C227 192.5 288.5 266.5 296 363"] },
  { gates: [10, 57], paths: ["M125 181C80 192.5 18.5 266.5 11 363"] },
  // G to Spleen/Sacral integration
  { gates: [34, 57], paths: ["M202 332C91.9328 334.895 58.9244 344.847 44.5 375.5"] },
];

// Gate positions - INSIDE each center, just inside the edge where the channel crosses
// All positions are manually placed to be clearly within center bounds
const GATE_POSITIONS: Record<number, { x: number; y: number }> = {
  // ============ HEAD CENTER (triangle, bounds ~x:118-189, y:5-66) ============
  // Inside bottom area where channels exit to Ajna
  64: { x: 138, y: 50 },   // left channel to 47
  61: { x: 153, y: 45 },   // middle channel to 24
  63: { x: 168, y: 50 },   // right channel to 4

  // ============ AJNA CENTER (inverted triangle, bounds ~x:118-189, y:77-138) ============
  // Inside top area where channels enter from Head
  47: { x: 138, y: 92 },   // from 64
  24: { x: 153, y: 88 },   // from 61
  4: { x: 168, y: 92 },    // from 63
  // Inside bottom area where channels exit to Throat
  17: { x: 138, y: 122 },  // to 62
  43: { x: 153, y: 126 },  // to 23
  11: { x: 168, y: 122 },  // to 56

  // ============ THROAT CENTER (rectangle, bounds ~x:121-185, y:160-224) ============
  // Inside top edge
  62: { x: 138, y: 172 },  // from 17
  23: { x: 153, y: 172 },  // from 43
  56: { x: 168, y: 172 },  // from 11
  // Inside bottom edge
  31: { x: 138, y: 210 },  // to 7
  8: { x: 153, y: 210 },   // to 1
  33: { x: 168, y: 210 },  // to 13
  // Inside right edge (Solar Plexus connections)
  12: { x: 176, y: 178 },  // to 22
  35: { x: 176, y: 192 },  // to 36
  16: { x: 176, y: 168 },  // to 48
  45: { x: 176, y: 185 },  // to 21
  // Inside left edge (integration)
  20: { x: 130, y: 182 },  // to 34, 57, 10

  // ============ G CENTER (diamond, bounds ~x:114-192, y:241-319) ============
  // Inside top area
  7: { x: 143, y: 258 },   // from 31
  1: { x: 153, y: 255 },   // from 8
  13: { x: 163, y: 258 },  // from 33
  // Inside bottom area
  15: { x: 143, y: 300 },  // to 5
  2: { x: 153, y: 303 },   // to 14
  46: { x: 163, y: 300 },  // to 29
  // Inside right side
  25: { x: 172, y: 275 },  // to 51
  // Inside left side
  10: { x: 134, y: 275 },  // to 57, 34, 20

  // ============ EGO CENTER (small shape, bounds ~x:199-250, y:301-345) ============
  // Inside the center
  51: { x: 215, y: 318 },  // from 25
  21: { x: 220, y: 328 },  // from 45
  26: { x: 228, y: 336 },  // to 44
  40: { x: 235, y: 340 },  // to 37

  // ============ SPLEEN CENTER (triangle left, bounds ~x:1-62, y:354-425) ============
  // Inside the triangle
  48: { x: 38, y: 372 },   // from 16
  57: { x: 42, y: 382 },   // integration
  44: { x: 38, y: 392 },   // from 26
  50: { x: 32, y: 400 },   // from 27
  18: { x: 22, y: 382 },   // to 58
  28: { x: 18, y: 395 },   // to 38
  32: { x: 25, y: 408 },   // to 54

  // ============ SACRAL CENTER (rectangle, bounds ~x:121-185, y:364-428) ============
  // Inside top edge
  5: { x: 138, y: 378 },   // from 15
  14: { x: 153, y: 378 },  // from 2
  29: { x: 168, y: 378 },  // from 46
  // Inside left edge
  34: { x: 130, y: 390 },  // integration
  27: { x: 130, y: 405 },  // to 50
  // Inside center (visible gate)
  59: { x: 153, y: 395 },  // to 6
  // Inside bottom edge
  42: { x: 138, y: 415 },  // to 53
  3: { x: 153, y: 415 },   // to 60
  9: { x: 168, y: 415 },   // to 52

  // ============ SOLAR PLEXUS CENTER (triangle right, bounds ~x:244-305, y:354-425) ============
  // Inside the triangle
  36: { x: 262, y: 372 },  // from 35
  22: { x: 258, y: 382 },  // from 12
  37: { x: 265, y: 390 },  // from 40
  6: { x: 260, y: 398 },   // from 59
  49: { x: 272, y: 400 },  // to 19
  55: { x: 280, y: 392 },  // to 39
  30: { x: 285, y: 405 },  // to 41

  // ============ ROOT CENTER (rectangle, bounds ~x:121-185, y:447-511) ============
  // Inside top edge
  53: { x: 138, y: 462 },  // from 42
  60: { x: 153, y: 462 },  // from 3
  52: { x: 168, y: 462 },  // from 9
  // Inside left edge
  54: { x: 130, y: 478 },  // from 32
  38: { x: 130, y: 490 },  // from 28
  58: { x: 130, y: 500 },  // from 18
  // Inside right edge
  19: { x: 176, y: 478 },  // from 49
  39: { x: 176, y: 490 },  // from 55
  41: { x: 176, y: 500 },  // from 30
};

// Helper to find channel definition by gates
function findChannelDef(gate1: number, gate2: number): ChannelDefinition | undefined {
  return ALL_CHANNELS.find(
    (ch) =>
      (ch.gates[0] === gate1 && ch.gates[1] === gate2) ||
      (ch.gates[0] === gate2 && ch.gates[1] === gate1)
  );
}

export default function Bodygraph2D({
  chartData,
  onElementSelect,
  selectedElement,
}: Bodygraph2DProps) {
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);

  // Get activated gates
  const allActivatedGates = useMemo(() => {
    const personality = Object.values(chartData.activations.personality).map((a) => a.gate);
    const design = Object.values(chartData.activations.design).map((a) => a.gate);
    return new Set([...personality, ...design]);
  }, [chartData]);

  // Get defined channel keys
  const definedChannelKeys = useMemo(() => {
    return new Set(
      chartData.channels.map(
        (ch) => `${Math.min(...ch.gates)}-${Math.max(...ch.gates)}`
      )
    );
  }, [chartData]);

  // Check if element is selected
  const isSelected = useCallback(
    (type: string, id: string) => {
      if (!selectedElement) return false;
      if (type === 'center' && selectedElement.type === 'center') {
        return selectedElement.name === id;
      }
      if (type === 'gate' && selectedElement.type === 'gate') {
        return selectedElement.number === parseInt(id);
      }
      if (type === 'channel' && selectedElement.type === 'channel') {
        return `${selectedElement.gates[0]}-${selectedElement.gates[1]}` === id ||
               `${selectedElement.gates[1]}-${selectedElement.gates[0]}` === id;
      }
      return false;
    },
    [selectedElement]
  );

  // Render a channel using exact SVG paths
  const renderChannel = useCallback(
    (channelPath: ChannelPath) => {
      const { gates, paths } = channelPath;
      const channelKey = `${Math.min(...gates)}-${Math.max(...gates)}`;
      const isDefined = definedChannelKeys.has(channelKey);
      const channelDef = findChannelDef(gates[0], gates[1]);

      const isHovered = hoveredElement === `channel-${channelKey}`;
      const isChannelSelected = isSelected('channel', channelKey);

      return (
        <g key={channelKey}>
          {paths.map((pathD, idx) => (
            <path
              key={`${channelKey}-${idx}`}
              d={pathD}
              fill="none"
              stroke={isDefined ? '#ff9d6c' : 'white'}
              strokeWidth={8}
              strokeLinecap="round"
              strokeOpacity={isDefined ? 0.9 : 0.12}
              style={{
                cursor: 'pointer',
                filter: isHovered || isChannelSelected ? `drop-shadow(0 0 8px ${isDefined ? '#ff9d6c' : 'white'})` : undefined,
                transition: 'filter 0.2s, stroke-opacity 0.2s',
              }}
              onMouseEnter={() => setHoveredElement(`channel-${channelKey}`)}
              onMouseLeave={() => setHoveredElement(null)}
              onClick={() => {
                if (channelDef) {
                  onElementSelect({
                    type: 'channel',
                    gates: channelDef.gates,
                    name: channelDef.name,
                    circuit: channelDef.circuit,
                  });
                }
              }}
            />
          ))}
        </g>
      );
    },
    [definedChannelKeys, hoveredElement, isSelected, onElementSelect]
  );

  // Render a center using exact SVG path
  const renderCenter = useCallback(
    (centerName: CenterName) => {
      const isDefined = chartData.centers[centerName]?.defined ?? false;
      const isHovered = hoveredElement === `center-${centerName}`;
      const isCenterSelected = isSelected('center', centerName);
      const pathD = CENTER_PATHS[centerName];

      // White for defined, dark purple for undefined
      const fillColor = isDefined ? 'white' : '#270D4A';

      return (
        <g key={centerName}>
          <path
            d={pathD}
            fill={fillColor}
            stroke={isDefined ? 'white' : 'transparent'}
            strokeWidth={isDefined ? 2 : 0}
            style={{
              cursor: 'pointer',
              filter: isHovered || isCenterSelected ? 'drop-shadow(0 0 12px white)' : undefined,
              transition: 'filter 0.2s',
            }}
            onMouseEnter={() => setHoveredElement(`center-${centerName}`)}
            onMouseLeave={() => setHoveredElement(null)}
            onClick={() =>
              onElementSelect({
                type: 'center',
                name: centerName,
                defined: isDefined,
              })
            }
          />
        </g>
      );
    },
    [chartData.centers, hoveredElement, isSelected, onElementSelect]
  );

  // Render a gate indicator - just text, no circle
  const renderGate = useCallback(
    (gateNumber: number) => {
      const centerName = GATE_CENTERS[gateNumber] as CenterName;
      if (!centerName || !allActivatedGates.has(gateNumber)) return null;

      const position = GATE_POSITIONS[gateNumber];
      if (!position) return null;

      // Check if the center is defined to determine text color
      const centerIsDefined = chartData.centers[centerName]?.defined ?? false;
      // Black text on white (defined) centers, white text on dark (undefined) centers
      const textColor = centerIsDefined ? '#1a0f2e' : 'white';

      const isHovered = hoveredElement === `gate-${gateNumber}`;
      const isGateSelected = isSelected('gate', gateNumber.toString());

      return (
        <text
          key={`gate-${gateNumber}`}
          x={position.x}
          y={position.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={textColor}
          fontSize="10"
          fontWeight="600"
          style={{
            cursor: 'pointer',
            filter: isHovered || isGateSelected ? 'drop-shadow(0 0 4px white)' : undefined,
            transition: 'filter 0.2s',
          }}
          onMouseEnter={() => setHoveredElement(`gate-${gateNumber}`)}
          onMouseLeave={() => setHoveredElement(null)}
          onClick={() =>
            onElementSelect({
              type: 'gate',
              number: gateNumber,
              center: centerName,
            })
          }
        >
          {gateNumber}
        </text>
      );
    },
    [allActivatedGates, chartData.centers, hoveredElement, isSelected, onElementSelect]
  );

  const centerNames: CenterName[] = [
    'head',
    'ajna',
    'throat',
    'g',
    'ego',
    'spleen',
    'sacral',
    'solar_plexus',
    'root',
  ];

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 306 511"
        className="w-full h-full max-w-[400px]"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {/* Channels layer (behind centers) */}
        <g className="channels">
          {CHANNEL_PATHS.map((channelPath) => renderChannel(channelPath))}
        </g>

        {/* Centers layer */}
        <g className="centers">
          {centerNames.map((centerName) => renderCenter(centerName))}
        </g>

        {/* Gates layer (on top) */}
        <g className="gates">
          {Array.from({ length: 64 }, (_, i) => i + 1).map((gate) => renderGate(gate))}
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-xs text-white/80">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-white" />
            <span>Defined</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#270D4A' }} />
            <span>Open</span>
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="absolute bottom-4 right-4 p-3 rounded-lg bg-black/40 backdrop-blur-md border border-white/10 text-xs text-white/60">
        <p>Click on any element to explore</p>
      </div>
    </div>
  );
}
