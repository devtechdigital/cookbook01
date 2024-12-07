-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create families table
CREATE TABLE families (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create family_members table
CREATE TABLE family_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('head', 'contributor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(family_id, user_id)
);

-- Create cookbooks table
CREATE TABLE cookbooks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    subtitle TEXT,
    theme TEXT NOT NULL DEFAULT 'warm' CHECK (theme IN ('warm', 'cool', 'neutral')),
    cover_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create cookbook_access table
CREATE TABLE cookbook_access (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cookbook_id UUID NOT NULL REFERENCES cookbooks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(cookbook_id, user_id)
);

-- Create recipes table
CREATE TABLE recipes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cookbook_id UUID NOT NULL REFERENCES cookbooks(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    backstory TEXT,
    prep_time INTEGER NOT NULL CHECK (prep_time >= 0),
    cook_time INTEGER NOT NULL CHECK (cook_time >= 0),
    notes TEXT,
    primary_image TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_by UUID NOT NULL REFERENCES auth.users(id)
);

-- Create recipe_images table
CREATE TABLE recipe_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create recipe_ingredients table
CREATE TABLE recipe_ingredients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    quantity TEXT NOT NULL,
    unit TEXT NOT NULL,
    item TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create recipe_steps table
CREATE TABLE recipe_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipe_id UUID NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
    step_number INTEGER NOT NULL,
    instruction TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create Row Level Security (RLS) policies
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cookbook_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_steps ENABLE ROW LEVEL SECURITY;

-- Families policies
CREATE POLICY "Users can view families they are members of"
    ON families FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM family_members
        WHERE family_members.family_id = families.id
        AND family_members.user_id = auth.uid()
    ));

CREATE POLICY "Family heads can create families"
    ON families FOR INSERT
    WITH CHECK (TRUE);

CREATE POLICY "Family heads can update their families"
    ON families FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM family_members
        WHERE family_members.family_id = families.id
        AND family_members.user_id = auth.uid()
        AND family_members.role = 'head'
    ));

-- Family members policies
CREATE POLICY "Users can view family members in their families"
    ON family_members FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM family_members AS fm
        WHERE fm.family_id = family_members.family_id
        AND fm.user_id = auth.uid()
    ));

CREATE POLICY "Family heads can manage family members"
    ON family_members FOR ALL
    USING (EXISTS (
        SELECT 1 FROM family_members AS fm
        WHERE fm.family_id = family_members.family_id
        AND fm.user_id = auth.uid()
        AND fm.role = 'head'
    ));

-- Cookbooks policies
CREATE POLICY "Users can view cookbooks they have access to"
    ON cookbooks FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM family_members
            WHERE family_members.family_id = cookbooks.family_id
            AND family_members.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM cookbook_access
            WHERE cookbook_access.cookbook_id = cookbooks.id
            AND cookbook_access.user_id = auth.uid()
        )
    );

CREATE POLICY "Family heads can manage cookbooks"
    ON cookbooks FOR ALL
    USING (EXISTS (
        SELECT 1 FROM family_members
        WHERE family_members.family_id = cookbooks.family_id
        AND family_members.user_id = auth.uid()
        AND family_members.role = 'head'
    ));

-- Cookbook access policies
CREATE POLICY "Family heads can manage cookbook access"
    ON cookbook_access FOR ALL
    USING (EXISTS (
        SELECT 1 FROM family_members
        WHERE family_members.family_id = (
            SELECT family_id FROM cookbooks WHERE id = cookbook_access.cookbook_id
        )
        AND family_members.user_id = auth.uid()
        AND family_members.role = 'head'
    ));

-- Recipes policies
CREATE POLICY "Users can view recipes in accessible cookbooks"
    ON recipes FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM cookbooks
            JOIN family_members ON family_members.family_id = cookbooks.family_id
            WHERE cookbooks.id = recipes.cookbook_id
            AND family_members.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM cookbook_access
            WHERE cookbook_access.cookbook_id = recipes.cookbook_id
            AND cookbook_access.user_id = auth.uid()
        )
    );

CREATE POLICY "Contributors can manage recipes"
    ON recipes FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM cookbooks
            JOIN family_members ON family_members.family_id = cookbooks.family_id
            WHERE cookbooks.id = recipes.cookbook_id
            AND family_members.user_id = auth.uid()
        ) OR
        EXISTS (
            SELECT 1 FROM cookbook_access
            WHERE cookbook_access.cookbook_id = recipes.cookbook_id
            AND cookbook_access.user_id = auth.uid()
        )
    );

-- Recipe components policies (images, ingredients, steps)
CREATE POLICY "Users can view recipe components"
    ON recipe_images FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM recipes
        WHERE recipes.id = recipe_images.recipe_id
        AND (
            EXISTS (
                SELECT 1 FROM cookbooks
                JOIN family_members ON family_members.family_id = cookbooks.family_id
                WHERE cookbooks.id = recipes.cookbook_id
                AND family_members.user_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM cookbook_access
                WHERE cookbook_access.cookbook_id = recipes.cookbook_id
                AND cookbook_access.user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Contributors can manage recipe components"
    ON recipe_images FOR ALL
    USING (EXISTS (
        SELECT 1 FROM recipes
        WHERE recipes.id = recipe_images.recipe_id
        AND (
            EXISTS (
                SELECT 1 FROM cookbooks
                JOIN family_members ON family_members.family_id = cookbooks.family_id
                WHERE cookbooks.id = recipes.cookbook_id
                AND family_members.user_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM cookbook_access
                WHERE cookbook_access.cookbook_id = recipes.cookbook_id
                AND cookbook_access.user_id = auth.uid()
            )
        )
    ));

-- Apply same policies to ingredients and steps
CREATE POLICY "Users can view recipe ingredients"
    ON recipe_ingredients FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM recipes
        WHERE recipes.id = recipe_ingredients.recipe_id
        AND (
            EXISTS (
                SELECT 1 FROM cookbooks
                JOIN family_members ON family_members.family_id = cookbooks.family_id
                WHERE cookbooks.id = recipes.cookbook_id
                AND family_members.user_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM cookbook_access
                WHERE cookbook_access.cookbook_id = recipes.cookbook_id
                AND cookbook_access.user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Contributors can manage recipe ingredients"
    ON recipe_ingredients FOR ALL
    USING (EXISTS (
        SELECT 1 FROM recipes
        WHERE recipes.id = recipe_ingredients.recipe_id
        AND (
            EXISTS (
                SELECT 1 FROM cookbooks
                JOIN family_members ON family_members.family_id = cookbooks.family_id
                WHERE cookbooks.id = recipes.cookbook_id
                AND family_members.user_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM cookbook_access
                WHERE cookbook_access.cookbook_id = recipes.cookbook_id
                AND cookbook_access.user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Users can view recipe steps"
    ON recipe_steps FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM recipes
        WHERE recipes.id = recipe_steps.recipe_id
        AND (
            EXISTS (
                SELECT 1 FROM cookbooks
                JOIN family_members ON family_members.family_id = cookbooks.family_id
                WHERE cookbooks.id = recipes.cookbook_id
                AND family_members.user_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM cookbook_access
                WHERE cookbook_access.cookbook_id = recipes.cookbook_id
                AND cookbook_access.user_id = auth.uid()
            )
        )
    ));

CREATE POLICY "Contributors can manage recipe steps"
    ON recipe_steps FOR ALL
    USING (EXISTS (
        SELECT 1 FROM recipes
        WHERE recipes.id = recipe_steps.recipe_id
        AND (
            EXISTS (
                SELECT 1 FROM cookbooks
                JOIN family_members ON family_members.family_id = cookbooks.family_id
                WHERE cookbooks.id = recipes.cookbook_id
                AND family_members.user_id = auth.uid()
            ) OR
            EXISTS (
                SELECT 1 FROM cookbook_access
                WHERE cookbook_access.cookbook_id = recipes.cookbook_id
                AND cookbook_access.user_id = auth.uid()
            )
        )
    ));