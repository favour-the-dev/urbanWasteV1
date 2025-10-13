"use client";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Trash2, MapPin, Save } from "lucide-react";
import InputField from "../ui/InputField";
import Button from "../ui/Button";
import Card from "../ui/Card";
import toast from "react-hot-toast";

const nodeSchema = z.object({
  name: z.string().min(1, "Node name is required"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

const edgeSchema = z.object({
  from: z.string().min(1, "From node is required"),
  to: z.string().min(1, "To node is required"),
  weight: z.number().min(0.1, "Weight must be greater than 0"),
});

const formSchema = z.object({
  nodes: z.array(nodeSchema).min(1, "At least one node is required"),
  edges: z.array(edgeSchema),
});

type FormData = z.infer<typeof formSchema>;

interface NodeFormProps {
  onSubmit: (data: {
    nodes: Array<{ name: string; coordinates: [number, number] }>;
    edges: Array<{ from: string; to: string; weight: number }>;
  }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function NodeForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: NodeFormProps) {
  const [activeTab, setActiveTab] = useState<"nodes" | "edges">("nodes");

  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nodes: [{ name: "", latitude: 4.8156, longitude: 7.0498 }], // Default Port Harcourt coords
      edges: [],
    },
  });

  const {
    fields: nodeFields,
    append: appendNode,
    remove: removeNode,
  } = useFieldArray({
    control,
    name: "nodes",
  });

  const {
    fields: edgeFields,
    append: appendEdge,
    remove: removeEdge,
  } = useFieldArray({
    control,
    name: "edges",
  });

  const watchedNodes = watch("nodes");
  const nodeNames = watchedNodes.map((node) => node.name).filter(Boolean);

  const handleFormSubmit = (data: FormData) => {
    try {
      // Transform data to match expected format
      const transformedData = {
        nodes: data.nodes.map((node) => ({
          name: node.name,
          coordinates: [node.latitude, node.longitude] as [number, number],
        })),
        edges: data.edges,
      };

      onSubmit(transformedData);
    } catch (error) {
      toast.error("Please check your data and try again");
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setActiveTab("nodes")}
          className={`
            flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200
            ${
              activeTab === "nodes"
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }
          `}
        >
          <MapPin className="w-4 h-4 inline mr-2" />
          Nodes ({nodeFields.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("edges")}
          className={`
            flex-1 py-2 px-4 text-sm font-medium rounded-md transition-all duration-200
            ${
              activeTab === "edges"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }
          `}
        >
          Connections ({edgeFields.length})
        </button>
      </div>

      {/* Nodes Tab */}
      {activeTab === "nodes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Collection Points
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendNode({ name: "", latitude: 4.8156, longitude: 7.0498 })
              }
            >
              <Plus className="w-4 h-4" />
              Add Node
            </Button>
          </div>

          <div className="max-h-96 overflow-y-auto space-y-4">
            {nodeFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium text-gray-900">
                    Node {index + 1}
                  </h4>
                  {nodeFields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeNode(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <InputField
                    label="Node Name"
                    placeholder="e.g., Market Square"
                    {...register(`nodes.${index}.name`)}
                    error={errors.nodes?.[index]?.name?.message}
                  />
                  <InputField
                    label="Latitude"
                    type="number"
                    step="any"
                    placeholder="4.8156"
                    {...register(`nodes.${index}.latitude`, {
                      setValueAs: (value) => parseFloat(value) || 0,
                    })}
                    error={errors.nodes?.[index]?.latitude?.message}
                  />
                  <InputField
                    label="Longitude"
                    type="number"
                    step="any"
                    placeholder="7.0498"
                    {...register(`nodes.${index}.longitude`, {
                      setValueAs: (value) => parseFloat(value) || 0,
                    })}
                    error={errors.nodes?.[index]?.longitude?.message}
                  />
                </div>
              </Card>
            ))}
          </div>

          {errors.nodes?.root && (
            <p className="text-sm text-red-600">{errors.nodes.root.message}</p>
          )}
        </div>
      )}

      {/* Edges Tab */}
      {activeTab === "edges" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Route Connections
            </h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendEdge({ from: "", to: "", weight: 1.0 })}
              disabled={nodeNames.length < 2}
            >
              <Plus className="w-4 h-4" />
              Add Connection
            </Button>
          </div>

          {nodeNames.length < 2 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                Add at least 2 nodes before creating connections.
              </p>
            </div>
          )}

          <div className="max-h-96 overflow-y-auto space-y-4">
            {edgeFields.map((field, index) => (
              <Card key={field.id} className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-medium text-gray-900">
                    Connection {index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEdge(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      From Node
                    </label>
                    <select
                      {...register(`edges.${index}.from`)}
                      className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 focus:border-emerald-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select node</option>
                      {nodeNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    {errors.edges?.[index]?.from && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.edges[index]?.from?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      To Node
                    </label>
                    <select
                      {...register(`edges.${index}.to`)}
                      className="w-full h-12 px-4 rounded-xl border-2 border-gray-200 bg-white hover:border-gray-300 focus:border-emerald-500 focus:outline-none transition-colors"
                    >
                      <option value="">Select node</option>
                      {nodeNames.map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                    </select>
                    {errors.edges?.[index]?.to && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.edges[index]?.to?.message}
                      </p>
                    )}
                  </div>

                  <InputField
                    label="Distance (km)"
                    type="number"
                    step="0.1"
                    placeholder="1.5"
                    {...register(`edges.${index}.weight`, {
                      setValueAs: (value) => parseFloat(value) || 0,
                    })}
                    error={errors.edges?.[index]?.weight?.message}
                  />
                </div>
              </Card>
            ))}
          </div>

          {edgeFields.length === 0 && nodeNames.length >= 2 && (
            <div className="p-8 text-center text-gray-500">
              <p>No connections added yet.</p>
              <p className="text-sm">
                Click "Add Connection" to create route connections between
                nodes.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={isLoading}>
          <Save className="w-4 h-4" />
          Save Network
        </Button>
      </div>
    </form>
  );
}
