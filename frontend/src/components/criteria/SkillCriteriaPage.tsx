import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  Target,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { positionService, skillService } from "@/services/api";
import {SkillCriterion} from "../../types/criteria";

const SkillCriteriaPage = () => {
  const { user } = useAuth();
  const [criteria, setCriteria] = useState<SkillCriterion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [positions, setPositions] = useState<{ id: number; name: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [ filterTerm, setFilterTerm ] = useState(0)

  // Remove edit functionality - this is now view-only for HR
  // const canEdit = user?.role?.name === "hr";

  const toggleAccordion = (id: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

    const fetchSkillCriteria = async () => {
      try {
        setLoading(true);
        setError(null);
        let skillsData;
        let positionsData;
        if (!(user?.role?.name === "hr" || user?.role?.name === "admin")) {
          skillsData = await skillService.getSkillsByPosition();
          positionsData=await positionService.getAllPositions();
        } else {
          skillsData = await skillService.getAllSkills();
        }

        
        setPositions(positionsData);
        setCriteria(skillsData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch skill criteria"
        );
        console.error("Error fetching skill criteria:", err);
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchSkillCriteria();
  }, [user]);

  const refreshData = () => {
    fetchSkillCriteria();
  };

  // Remove edit and delete handlers - this page is now view-only
  // const handleModalSuccess = async () => { ... };
  // const handleEdit = (criterion: SkillCriterion) => { ... };
  // const handleDeleteClick = (criterion: SkillCriterion) => { ... };
  // const handleDeleteConfirm = async () => { ... };
  // const handleDeleteCancel = () => { ... };

  const getPositionNames = (positionIds: number) => {
    let position = positions.filter((p)=>p.id === positionIds)
    return position[0].name || "Not specified";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading skill criteria...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  let filteredCriteria = criteria.filter((criterion) => {

    let filter = criterion.positionId === filterTerm;
    if(filterTerm === 0){
      filter = true;
    }

    const matchesSearch = criterion.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    return matchesSearch && filter;
  });

  return (
    <div className="">
      <div className="flex justify-between mb-4 items-center">
        <div>
          <h1 className="text-3xl font-bold">Skill Criteria</h1>
          <p className="text-gray-600 mt-1">
            View skill criteria and definitions for all positions
          </p>
        </div>
        {/* Removed HR Admin Dashboard note since HR users no longer have access to admin functions */}
      </div>

      {/* Remove SkillCreationModal and DeleteModal - view-only page */}
      {/* <SkillCreationModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSkill(null);
        }}
        onSuccess={handleModalSuccess}
        editSkill={editingSkill}
        mode={editingSkill ? "edit" : "create"}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      /> */}

      <div className="space-y-4">
         {/* Need to implement a filter section here */}
         <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex gap-4 sm:flex-row flex-col sm:items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    placeholder="Search skills..."
                    className="pl-10 w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div> 
                {(user?.role.name === "hr" || user?.role.name === "admin") && (              
                 <div className="relative">
                  
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <select
                    className="pl-10 w-64 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                    value={filterTerm}
                    onChange={(e) => {
                        setFilterTerm(parseInt(e.target.value))
                    }}
                  >
                    <option value="0">All Positions</option>
                    {positions.map((position) => (
                      <option key={position.id} value={position.id}>
                        {position.name}
                      </option>
                    ))}
                  </select> 
                </div>
                )}
        </div>
              {/* <div className="flex gap-2">
                <button
                  onClick={refreshData}
                  className="flex items-center gap-2 px-4 py-2 bg-background border text-gray-700 rounded-md hover:bg-gray-200 transition-colors duration-150"
                >
                  <RefreshCw className="h-4 w-4" />
                  Refresh
                </button>
                 Remove Add Criterion button - this is now view-only 
                 {canEdit && (
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition-colors duration-150"
                  >
                    <Plus className="h-4 w-4" />
                    Add Criterion
                  </button>
                )} 
              </div> */}
            </div>
        </div>
        </div>


        {filteredCriteria.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-12 text-center">
            <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              No skill criteria found
            </h3>
            <p className="text-gray-500 mb-6">
              No skill criteria found matching your search filters.
            </p>
            {/* Remove Add First Criterion button - this is now view-only */}
            {/* {canEdit && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                <Plus className="h-5 w-5" />
                Add First Criterion
              </button>
            )} */}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredCriteria.map((criterion) => (
              <div
                key={criterion.id}
                className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md"
              >
                {/* Accordion Header */}
                <div
                  className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                  onClick={() => toggleAccordion(criterion.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {expandedItems.has(criterion.id) ? (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-gray-500" />
                      )}
                      <h3 className="text-lg font-semibold text-gray-800">
                        {criterion.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getPositionNames(criterion.positionId)}
                      </span>
                      {criterion.createdBy && (<span className="text-sm text-gray-500">
                        Created by {criterion.createdBy}
                      </span>)}
                    </div>
                  </div>

                  {/* Remove Edit and Delete buttons - this is now view-only */}
                  {/* {canEdit && (
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => handleEdit(criterion)}
                        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-150"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(criterion)}
                        className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors duration-150"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  )} */}
                </div>

                {/* Accordion Content */}
                {expandedItems.has(criterion.id) && (
                  <div className="border-t border-gray-100 bg-gray-50">
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                        {/* basic Level */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                            <h4 className="font-semibold text-gray-700">
                              Basic Level
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 bg-white p-3 rounded-md border border-gray-200 min-h-[80px]">
                            {criterion.basic || "Not defined"}
                          </p>
                        </div>

                        {/* Low Level */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-400"></div>
                            <h4 className="font-semibold text-gray-700">
                              low Level
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 bg-white p-3 rounded-md border border-gray-200 min-h-[80px]">
                            {criterion.low || "Not defined"}
                          </p>
                        </div>

                        {/* Medium Level */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                            <h4 className="font-semibold text-gray-700">
                              Medium Level
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 bg-white p-3 rounded-md border border-gray-200 min-h-[80px]">
                            {criterion.medium || "Not defined"}
                          </p>
                        </div>

                        {/* high Level */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                            <h4 className="font-semibold text-gray-700">
                              high Level
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 bg-white p-3 rounded-md border border-gray-200 min-h-[80px]">
                            {criterion.high || "Not defined"}
                          </p>
                        </div>

                        {/* High Level
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            <h4 className="font-semibold text-gray-700">
                              High Level
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 bg-white p-3 rounded-md border border-gray-200 min-h-[80px]">
                            {criterion.high || "Not defined"}
                          </p>
                        </div>
                      </div> */}

                      {/* Expert Level */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            <h4 className="font-semibold text-gray-700">
                              Expert Level
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 bg-white p-3 rounded-md border border-gray-200 min-h-[80px]">
                            {criterion.expert || "Not defined"}
                          </p>
                        </div>
                      </div>

                      {/* Additional Info */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>
                            Created on{" "}
                            {new Date(criterion.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillCriteriaPage;
