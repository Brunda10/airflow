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
import { Select } from "src/components/ui";
import { directionOptions, type Direction } from "src/components/Graph/useGraphLayout";
import type { TFunction } from "i18next";

type GraphOptionsProps = {
  readonly direction: Direction;
  readonly onChange: (event: { value: Array<string> }) => void;
  readonly translate: TFunction;
}

export const GraphOptions = ({ direction, onChange, translate }: GraphOptionsProps) => (
    <Select.Root
      // @ts-expect-error Collection type mismatch; directionOptions returns Collection
      collection={directionOptions(translate)}
      onValueChange={onChange}
      size="sm"
      value={[direction]}
    >
      <Select.Label fontSize="xs">{translate("assets:panel.graphDirection.label")}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        <Select.Content>
          {directionOptions(translate).items.map((option) => (
            <Select.Item item={option} key={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  );
