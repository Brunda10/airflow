/*!
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { Panel } from "react-resizable-panels";
import { useToken,  Popover,Portal ,Button, Box,  Flex} from "@chakra-ui/react";
import type { Direction } from "src/components/Graph/useGraphLayout";
import { ReactFlow, Controls, Background, MiniMap, type Node as ReactFlowNode } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useParams } from "react-router-dom";

import type { AssetResponse } from "openapi/requests/types.gen";
import { DownloadButton } from "src/components/Graph/DownloadButton";
import { edgeTypes, nodeTypes } from "src/components/Graph/graphTypes";
import type { CustomNodeProps } from "src/components/Graph/reactflowUtils";
import { useGraphLayout } from "src/components/Graph/useGraphLayout";
import { useColorMode } from "src/context/colorMode";
import { useDependencyGraph } from "src/queries/useDependencyGraph";
import { getReactFlowThemeStyle } from "src/theme";
import { useLocalStorage } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import { FiChevronDown } from "react-icons/fi";
import {GraphOptions} from "./AssetGraphOptions";

export const AssetGraph = ({ asset }: { readonly asset?: AssetResponse }) => {
  const { assetId } = useParams();
  const { colorMode = "light" } = useColorMode();
  const { t: translate } = useTranslation(["components", "assets"]);
  const [direction, setDirection] = useLocalStorage<Direction>(`direction-${assetId}`, "RIGHT");

  const { data = { edges: [], nodes: [] } } = useDependencyGraph(`asset:${assetId}`);

  const { data: graphData } = useGraphLayout({
    ...data,
    direction, // 👈 Use selected direction
    openGroupIds: [],
  });

  const nodes = graphData?.nodes.map((node) =>
    node.id === `asset:${assetId}` ? { ...node, data: { ...node.data, isSelected: true } } : node,
  );

  const [selectedDarkColor, selectedLightColor] = useToken("colors", ["bg.muted", "bg.emphasized"]);

  const selectedColor = colorMode === "dark" ? selectedDarkColor : selectedLightColor;

  const edges = (graphData?.edges ?? []).map((edge) => ({
    ...edge,
    data: {
      ...edge.data,
      rest: {
        ...edge.data?.rest,
        isSelected: `asset:${asset?.id}` === edge.source || `asset:${asset?.id}` === edge.target,
      },
    },
  }));

  const handleDirectionUpdate = (
    event: SelectValueChangeDetails<{ label: string; value: Array<string> }>,
  ) => {
    if (event.value[0] !== undefined) {
      setDirection(event.value[0] as Direction);
    }
  };


  return (
    <Box display="flex" flexDirection="column" h="100%" minHeight={0} position="relative">
      {/* Graph Panel */}
      <Box flex="1" minHeight={0} position="relative">
        <Box position="absolute" right="12px" top="8px" zIndex={10}>
           {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
          <Popover.Root  autoFocus={false} positioning={{ placement: "bottom-end" }}>
            <Popover.Trigger asChild>
              <Button rightIcon={<FiChevronDown size={12} />} size="sm" variant="outline">
                {translate("assets:panel.buttons.options")}
              </Button>
            </Popover.Trigger>
            <Portal>
              { }
              <Popover.Positioner style={{ zIndex: 9999 }}>
                <Popover.Content>
                  <Popover.Arrow />
                  <Popover.Body display="flex" flexDirection="column" gap={3} p={2}>
                    <GraphOptions direction={direction} onChange={handleDirectionUpdate} translate={translate} />
                  </Popover.Body>
                </Popover.Content>
              </Popover.Positioner>
            </Portal>
          </Popover.Root>
        </Box>
        <ReactFlow
          colorMode={colorMode}
          defaultEdgeOptions={{ zIndex: 1 }}
          edges={edges}
          edgeTypes={edgeTypes}
          // Fit view to selected task or the whole graph on render
          fitView
          maxZoom={1.5}
          minZoom={0.25}
          nodes={nodes}
          nodesDraggable={false}
          nodeTypes={nodeTypes}
          onlyRenderVisibleElements
          style={getReactFlowThemeStyle(colorMode)}
        >
          <Background />
          <Controls showInteractive={false} />
          <MiniMap
            nodeStrokeColor={(node: ReactFlowNode<CustomNodeProps>) =>
              node.data.isSelected && selectedColor !== undefined ? selectedColor : ""
            }
            nodeStrokeWidth={15}
            pannable
            zoomable
          />
          <DownloadButton name={asset?.name ?? asset?.uri ?? "asset"} />
        </ReactFlow>
      </Box>
    </Box>
  );
};
