"use client";

import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STEP_CONFIGS = {
  1: {
    title: "Data Collection",
    parameters: {
      source_type: ["csv", "api", "database", "web_scraping"],
      path: "string",
      delimiter: "string",
      headers: "boolean",
      sample_size: "number",
      label_column: "string"
    }
  },
  2: {
    title: "Data Preprocessing",
    parameters: {
      missing_data: ["drop", "mean", "median", "mode"],
      categorical_encoding: ["one_hot", "label"],
      feature_scaling: ["standard", "minmax", "none"],
      text_processing: ["tfidf", "count_vectorizer"],
      outlier_removal: ["zscore", "iqr", "none"],
      test_size: "number"
    }
  },
  3: {
    title: "Model Selection",
    parameters: {
      problem_type: ["classification", "regression", "clustering"],
      algorithm: ["random_forest", "logistic_regression", "xgboost","svm","knn","decision_tree","naive_bayes","linear_regression","kmeans","ridge_regression","lasso_regression"],
      interpretability: ["high", "medium", "low"],
      training_speed: ["fast", "medium", "slow"]
    }
  },
  4: {
    title: "Model Training",
    parameters: {
      n_estimators: "number",
      max_depth: "number",
      learning_rate: "number",
      cross_validation: "number",
      early_stopping: "boolean",
      random_state: "number"
    }
  },
  5: {
    title: "Model Evaluation",
    parameters: {
      metrics: ["accuracy", "f1", "roc_auc", "precision", "recall"," mse", "rmse","r2","mae"],
      confusion_matrix: "boolean",
      feature_importance: "boolean",
      shap_analysis: "boolean"
    }
  },
  6: {
    title: "Model Tuning",
    parameters: {
      method: ["grid_search", "random_search", "bayesian"],
      n_iter: "number"
    }
  },
  7: {
    title: "Deployment",
    parameters: {
      format: ["flask_api", "fastapi", "pickle"],
      monitoring: ["drift", "performance", "none"]
    }
  }
};



export function StepParameters({ step, onUpdate }: { step: number; onUpdate: (params: any) => void }) {
  const [params, setParams] = useState({});
  const [data, setData] = useState<Record<string, Record<string, any>>>({});


  const config = STEP_CONFIGS[step as keyof typeof STEP_CONFIGS] || {
    title: "Custom Step",
    parameters: {
      custom_param: "string"
    }
  };

  const handleParamChange = (key: string, value: any) => {
    const newParams = { ...params, [key]: value };
    setParams(newParams);
    onUpdate(newParams);
    console.log("Updated parameters:", newParams);
    console.log("config title : ", config.title);

    const updatedSelection = {
      ...data[config.title],
      [key]: value
    };

    const updatedData = {
      ...data,
      [config.title]: updatedSelection
    };

    setData(updatedData);
    onUpdate(updatedData);  //propagate the updated data to the parent component
    console.log("Updated data:", updatedData);
    console.log("updatedData ", updatedData);
    
  };


  useEffect(() => {
    setTimeout(() => {
      console.log("Final Data: ", data);
    }, 1000);
  }, [data]);


  return (
    <div className="space-y-4">
      {Object.entries(config.parameters).map(([key, type]) => (
        <div key={key} className="space-y-2">
          <Label htmlFor={key}>{key.replace(/_/g, " ").toUpperCase()}</Label>
          {Array.isArray(type) ? (
            <Select onValueChange={(value) => handleParamChange(key, value)}>
              <SelectTrigger>
                <SelectValue placeholder={`Select ${key}`} />
              </SelectTrigger>
              <SelectContent>
                {type.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <Input
              id={key}
              type={type === "number" ? "number" : "text"}
              onChange={(e) => {
                const value = type === "boolean" 
                  ? e.target.value === "true"
                  : type === "number" 
                    ? Number(e.target.value)
                    : e.target.value;
                handleParamChange(key, value);
              }}
              placeholder={`Enter ${key}`}
            />
          )}
        </div>
      ))}
    </div>
  );
}