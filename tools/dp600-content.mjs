// Authored adaptations of the supplied answer-free PDF, not an official answer key.
// Keep source question numbers stable so progress survives content edits.
const learn = 'https://learn.microsoft.com/en-us/';
export const refs = {
 git:learn+'fabric/cicd/git-integration/intro-to-git-integration',
 sql:learn+'sql/t-sql/queries/select-group-by-transact-sql',
 spark:'https://spark.apache.org/docs/latest/api/python/reference/pyspark.sql/api/pyspark.sql.DataFrame.describe.html',
 notebook:learn+'fabric/data-engineering/notebook-visualization',
 profile:learn+'powerquery-m/table-profile',
 history:'https://docs.delta.io/latest/delta-utility.html',
 lookup:learn+'fabric/data-factory/lookup-activity',
 dax:learn+'dax/sameperiodlastyear-function-dax',
 rank:learn+'sql/t-sql/functions/row-number-transact-sql',
 shortcut:learn+'fabric/onelake/onelake-shortcuts',
 clone:learn+'fabric/data-warehouse/clone-table',
 s3:learn+'fabric/onelake/create-s3-shortcut',
 identity:learn+'dax/userobjectid-function-dax',
 upn:learn+'dax/userprincipalname-function-dax',
 endpoint:learn+'fabric/data-engineering/lakehouse-sql-analytics-endpoint',
 ctas:learn+'fabric/data-warehouse/ingest-data-tsql',
 domain:learn+'fabric/governance/domains',
 rls:learn+'fabric/data-warehouse/row-level-security',
 star:learn+'power-bi/guidance/star-schema',
 workspace:learn+'fabric/security/workspace-identity',
 roles:learn+'fabric/fundamentals/roles-workspaces',
 duration:learn+'powerquery-m/duration-days',
 ols:learn+'fabric/security/service-admin-object-level-security',
 format:learn+'power-bi/create-reports/desktop-dynamic-format-strings',
 warehouse:learn+'fabric/data-warehouse/data-warehousing',
 python:learn+'power-bi/connect-data/desktop-python-visuals',
 script:learn+'fabric/data-factory/script-activity',
 evaluate:learn+'dax/evaluate-statement-dax',
 large:learn+'fabric/enterprise/powerbi/service-premium-large-models',
 pbip:learn+'power-bi/developer/projects/projects-overview',
 xmla:learn+'fabric/enterprise/powerbi/service-premium-connect-tools',
 bridge:learn+'power-bi/guidance/relationships-many-to-many',
 incremental:learn+'power-bi/connect-data/incremental-refresh-overview',
 aggregation:learn+'power-bi/transform-model/aggregations-advanced',
 scale:learn+'fabric/enterprise/powerbi/service-premium-scale-out',
 lake:learn+'fabric/fundamentals/direct-lake-overview',
 layout:learn+'power-bi/transform-model/desktop-modeling-view',
 memory:learn+'fabric/fundamentals/direct-lake-understand-storage',
 copy:learn+'fabric/data-factory/connector-lakehouse-copy-activity',
 vacuum:learn+'fabric/data-engineering/delta-lake-vacuum',
 fuzzy:learn+'power-query/merge-queries-fuzzy-match',
 path:learn+'fabric/data-factory/activity-overview',
 bpa:'https://docs.tabulareditor.com/te2/Best-Practice-Analyzer.html',
 perf:'https://daxstudio.org/docs/features/traces/server-timings-trace/',
 scripting:'https://docs.tabulareditor.com/te2/Advanced-Scripting.html',
 calc:learn+'dax/selectedmeasure-function-dax',
 filters:learn+'dax/best-practices/dax-avoid-avoid-filter-as-filter-argument',
 test:learn+'fabric/security/service-admin-row-level-security'
};
export const bank=[];
function add(n,d,t,q,opts,a,why,hints,ref,extra={}){
 const item={id:`pdf72-${n}`,d,t,type:Array.isArray(a)?'multi':'mc',q,opts,a,
 ...(Array.isArray(a)?{pick:a.length}:{}),why,hints,refs:[refs[ref]],source:[n],...extra};
 if(item.type==='yn'||item.type==='order'){delete item.opts;delete item.pick;}
 bank.push(item);
}
add(1,'maintain','Git providers','A research team needs branching and version history for supported Fabric report and semantic model definitions. Which TWO repository providers can a workspace connect to?',
 ['GitHub','Azure DevOps (Azure Repos)','OneDrive','An ADLS Gen2 folder'],[0,1],
 'Both GitHub and Azure DevOps support workspace Git integration. File storage alone does not provide this integration. This adaptation updates the PDF question, whose single-answer choices are ambiguous under current Fabric behavior.',
 ['What does branching require beyond storing files?','Which choices are Git repository providers supported by Fabric?'],'git');
add(2,'prepare','SQL aggregation','Sales has ProductID, ProductName, SaleDate and Amount. Return each product whose total sales in 2023 exceed 10,000. Which approach is correct?',
 ['Filter dates with WHERE, group by both product columns, then HAVING SUM(Amount) > 10000','Use WHERE Amount > 10000 before grouping','Group only by ProductID while selecting ProductName too','Use HAVING SaleDate without grouping or aggregating it'],0,
 'WHERE selects the 2023 input rows. GROUP BY forms one result per product. HAVING applies the threshold to each group total; filtering individual amounts would discard smaller transactions that contribute to that total.',
 ['Is the threshold about a transaction or a product total?','Which clause filters groups after aggregation?'],'sql');
add(3,'prepare','Distributed analysis','A billion JSON records in OneLake need parallel transformation and time-series exploration in a Fabric notebook. Which processing library fits?',
 ['PySpark','Single-machine pandas','Power BI core visuals alone'],0,
 'PySpark distributes processing across Spark workers. A local pandas DataFrame requires the data to fit on one machine; report visuals alone do not supply the distributed transformation workflow.',
 ['Can a billion records comfortably fit in one local process?','Which option distributes work across a cluster?'],'spark');
add(4,'prepare','Descriptive analytics','You plot retained and lost customers by age, geography and tenure to summarize observed churn. You have not trained a prediction model or tested causes. What kind of analytics is this?',
 ['Diagnostic','Descriptive','Prescriptive','Predictive'],1,
 'Summarizing the observed distribution is descriptive analytics. Predicting future churn, proving its causes, or recommending an action would require additional work.',
 ['Are you describing observations or estimating future outcomes?','Does a chart of associations establish why customers left?'],'notebook');
add(5,'model','Time intelligence','A model has a valid date table and a [Sales] measure. Which expression returns sales for the same date period one year earlier?',
 ["CALCULATE([Sales], SAMEPERIODLASTYEAR('Date'[Date]))","SUMX('Date', [Sales])","CALCULATE([Sales], ALL('Date'))","YEAR(MAX('Date'[Date])) - 1"],0,
 'SAMEPERIODLASTYEAR supplies shifted dates. CALCULATE evaluates the sales measure in that date context. Returning a year number does not evaluate sales, and removing date filters loses the comparable period.',
 ['Do you need a number representing a year, or a changed date filter?','What evaluates an existing measure under a replacement filter context?'],'dax');
add(7,'prepare','Power Query profiling','Which Power Query M function returns per-column statistics such as count, minimum, maximum, average, standard deviation and null count?',
 ['Table.Schema','Table.View','Table.FuzzyGroup','Table.Profile'],3,
 'Table.Profile summarizes column values. Table.Schema describes types and metadata; it does not compute these descriptive statistics.',
 ['Are you inspecting column definitions or the values inside columns?','Which function creates a statistical profile?'],'profile');
add(8,'prepare','Delta maintenance history','You want to inspect recorded operations on a Delta table to see whether OPTIMIZE ran. Which Spark SQL command should you use?',
 ['DESCRIBE DETAIL Customer','DESCRIBE HISTORY Customer','SELECT * FROM Customer','EXPLAIN SELECT * FROM Customer'],1,
 'DESCRIBE HISTORY exposes the operation history retained in the Delta log. DETAIL describes the current table, and EXPLAIN describes a query plan. Absence of an old operation outside retained history is not proof it never ran.',
 ['Do you need the current table properties or a timeline of operations?','Which command is about past versions and their operations?'],'history');
add(9,'prepare','Spark plans versus statistics','Does df.explain().show() calculate minimum, maximum, mean and standard deviation for a Spark DataFrame?',
 ['Yes','No'],1,
 'explain prints a query plan, not descriptive statistics, and returns no DataFrame to call show on. Use df.describe().show() for supported descriptive statistics.',
 ['What does an execution plan tell you about the data values?','Does explain return a table of statistics?'],'spark');
add(13,'prepare','Latest row per customer','Stage.Customers can contain many versions per CustomerID. Assuming LastUpdated is unique within each customer, how do you return the latest complete row for each customer?',
 ['ROW_NUMBER() OVER (PARTITION BY CustomerID ORDER BY LastUpdated DESC), then filter row number = 1','SELECT DISTINCT CustomerID, Name, PostalCode, LastUpdated','Take MAX(Name) and MAX(PostalCode) independently','Order the whole table by LastUpdated and take one row'],0,
 'Partitioning ranks versions within each customer. Descending time places the latest row first. Independent maxima can combine fields from different records; DISTINCT does not choose the latest version.',
 ['Should numbering restart for each customer?','Which sort direction puts the most recent version first?'],'rank');
add(17,'prepare','Spark descriptive statistics','Does df.describe().show() display summary statistics for numeric and string columns in a Spark DataFrame?',
 ['Yes','No'],0,
 'describe returns count, mean, standard deviation, minimum and maximum summaries for supported columns. Mean and standard deviation are not meaningful for nonnumeric strings and may be null; the method does not make them numeric.',
 ['Which method summarizes values rather than explaining a query plan?','Would every statistic be meaningful for a customer-name string?'],'spark');
add(18,'prepare','Pipeline result sets','A stored procedure returns one result set containing active-customer count and average sales. A pipeline must use these values in later activities. Which activity fits?',
 ['Switch','Get metadata','Lookup','Append variable'],2,
 'Lookup executes a query or stored procedure and exposes the returned result set in its output. Later expressions can read firstRow or value depending on configuration. A Switch chooses a branch; it does not retrieve SQL results.',
 ['Does the next activity need execution to finish, or actual returned values?','Which activity reads a result set into pipeline output?'],'lookup',{source:[18,27,33,70,181]});
add(20,'prepare','Duplicate emails','Which SQL pattern returns at most 1,000 email values that occur more than once in DimCustomer?',
 ['SELECT TOP (1000) Email FROM DimCustomer GROUP BY Email HAVING COUNT(*) > 1','SELECT TOP (1000) DISTINCT Email FROM DimCustomer','SELECT Email FROM DimCustomer WHERE COUNT(*) > 1','SELECT TOP (1000) Email FROM DimCustomer ORDER BY Email'],0,
 'Grouping makes one row per email; HAVING retains groups with multiple records. DISTINCT removes repetitions without telling you which values were duplicated. Add ORDER BY if a deterministic top 1,000 is required.',
 ['How do you turn repeated email values into groups you can count?','Would DISTINCT identify which values were repeated?'],'sql');
add(23,'prepare','Reading Delta shortcuts','A schema-disabled default lakehouse exposes a Delta shortcut called ResearchProduct directly under Tables. How can a PySpark notebook read that relative path?',
 ['spark.read.format("delta").load("Tables/ResearchProduct")','spark.read.format("csv").load("Tables/ResearchProduct")','external_table("ResearchProduct")','spark.read.format("delta").load("Files/ResearchProduct")'],0,
 'The reader must match both the Delta format and the actual Tables path. external_table is a KQL function. This question explicitly uses a schema-disabled lakehouse; schema-enabled paths can differ.',
 ['What is the source format, and where was the shortcut created?','Which option matches both facts without switching query languages?'],'shortcut',{source:[23,31,133]});
add(28,'prepare','Warehouse clones','What does CREATE TABLE test.FactSales AS CLONE OF dbo.FactSales initially create?',
 ['An independent table referencing the existing data files without a full physical copy','A view that always returns the latest source rows','An empty table with no rows','A full row-by-row copy of every file'],0,
 'A clone creates a separate table using shared underlying files at the selected point in time. It is not a live view; later changes to the source do not automatically appear in the clone.',
 ['Is the goal a snapshot or a continuously changing view?','Could two table definitions initially reference the same data files?'],'clone',{source:[28,178]});
add(29,'prepare','S3 shortcut credentials','For an Amazon S3 shortcut using key-based authentication, which TWO credentials identify and authenticate the AWS access key?',
 ['Azure SAS token','AWS secret access key','AWS access key ID','Certificate thumbprint'],[1,2],
 'An AWS access key consists of an access key ID and secret access key. A SAS token belongs to Azure Storage; a certificate thumbprint is not this S3 authentication pair.',
 ['Which cloud owns the bucket?','What are the identifier and secret halves of an AWS access key?'],'s3');
add(34,'model','Identity values','A dynamic RLS rule needs the signed-in user principal name (for example, alex@contoso.com). Does USEROBJECTID() return that value?',
 ['Yes','No'],1,
 'USEROBJECTID returns the directory object identifier, not the UPN string. Comparing that identifier to an email-style UPN column would not produce the intended match.',
 ['Is an object ID the same kind of value as alex@contoso.com?','What identity format does the security mapping table store?'],'identity');
add(35,'prepare','SQL analytics endpoint','A lakehouse contains a managed Delta table. What can its SQL analytics endpoint do directly to the table data?',
 ['Read it with SELECT','Update its rows with UPDATE','Insert rows with INSERT','Delete rows with DELETE'],0,
 'The lakehouse SQL analytics endpoint queries the Delta table data but does not provide T-SQL data modification for those lakehouse tables. Use an appropriate Spark or ingestion path to write them.',
 ['Is this a warehouse or a lakehouse SQL endpoint?','Does a SQL query interface necessarily permit data writes?'],'endpoint');
add(36,'model','Dynamic RLS','Which DAX function explicitly returns the current user principal name for a dynamic RLS mapping?',
 ['USEROBJECTID()','USERPRINCIPALNAME()','DISTINCTCOUNT(Users[UPN])','SELECTEDVALUE(Users[Name])'],1,
 'USERPRINCIPALNAME returns the current identity as a UPN. A selected table value is filter-context data and does not itself authenticate the current user.',
 ['Do you need a value from report filters or the authenticated identity?','Which function promises the exact identity format requested?'],'upn');
add(39,'prepare','Creating a table from a query','A warehouse needs a new point-in-time table from a join of two queryable tables. Which operation creates the target and populates it from the query in one statement?',
 ['INSERT INTO alone','CREATE TABLE AS SELECT (CTAS)','CREATE TABLE AS CLONE OF','CREATE VIEW'],1,
 'CTAS creates and populates a table from SELECT output, deriving column definitions from the query expressions. INSERT needs an existing target. A clone snapshots one existing table rather than an arbitrary join.',
 ['Does the destination table already exist?','Which operation accepts an arbitrary SELECT while creating a table?'],'ctas');
add(42,'maintain','Domain administration','A user must create a NEW top-level Fabric domain, then create subdomains and assign workspaces. Which listed role permits all these tasks?',
 ['Domain admin of an existing domain','Domain contributor','Fabric admin','Workspace Admin'],2,
 'Creating a top-level domain requires Fabric admin. A domain admin manages an assigned domain; that scope does not itself allow creating a new top-level domain.',
 ['Which requirement is above the scope of an existing domain?','Could a workspace role administer tenant-wide organization?'],'domain');
add(44,'maintain','Warehouse RLS','Which TWO SQL objects implement row filtering for a warehouse table?',
 ['Stored procedure','Inline table-valued function','Security policy','CHECK constraint'],[1,2],
 'The function expresses the row predicate. The security policy binds that predicate to the protected table. A CHECK constraint validates written data rather than filtering readers.',
 ['What expresses the rule, and what attaches it to a table?','Would merely defining a function make every SELECT use it?'],'rls');
add(45,'prepare','Dimension attributes','Which set belongs in a product dimension for a sales star schema?',
 ['ProductID, ProductName, ProductColor','TransactionID, SalesAmount, Quantity','SaleDate, TransactionID, SalesAmount','ProductName, TransactionID, Quantity'],0,
 'A dimension identifies and describes a business entity. Transaction identifiers and sale amounts belong at the fact grain, not among product descriptions.',
 ['Which fields describe a product independently of a sale?','Would a product name change for every transaction?'],'star');
add(47,'prepare','Column maxima','You need the maximum value of EACH numeric column in a Power Query table. Which function provides a per-column statistical summary?',
 ['Table.Max','Table.MaxN','Table.Range','Table.Profile'],3,
 'Table.Profile reports statistics by column. Table.Max chooses a row using comparison criteria, and Table.MaxN chooses rows; neither is the requested all-column profile.',
 ['Are you looking for the biggest row or a maximum for every column?','Which result shape matches one summary per column?'],'profile',{source:[47,103]});
add(64,'maintain','Workspace identity and access','You create a workspace for Finance. The Finance group must edit items without being admins, and the workspace needs an identity for supported Azure Storage connections. Which TWO actions fit? Storage access will be granted separately.',
 ['Assign Contributor to the Finance group','Create a workspace identity','Make every Finance user an Admin','Assign roles separately to every user'],[0,1],
 'Contributor supplies item authoring rights without workspace administration. A workspace identity provides a managed identity for supported connections, but still needs appropriate storage authorization. Group assignment avoids per-user administration.',
 ['Separate the human users from the identity used by the connection.','Does creating an identity automatically grant it access to a storage account?'],'workspace');
add(69,'prepare','Notebook chart view','Which call exposes a Spark DataFrame in the Fabric notebook interactive table and Chart view?',
 ['displayHTML(df)','df.show()','df.write','display(df)'],3,
 'display renders the notebook interactive output. show prints a textual preview; write persists data; displayHTML renders supplied HTML.',
 ['Do you need text output or an interactive notebook result?','Which function is the notebook display helper?'],'notebook');
add(73,'prepare','Date durations','Order_Date and Shipping_Date are date columns. Which expression returns the number of elapsed days between them?',
 ['Duration.Days([Shipping_Date] - [Order_Date])','Date.AddDays([Order_Date], 1)','DateTime.LocalNow()','Duration.From([Shipping_Date])'],0,
 'Subtracting the two dates yields a duration. Duration.Days extracts its day component. Adding a day changes a date; the current timestamp does not measure shipping time.',
 ['What type results from subtracting dates?','Which function extracts the day count from that result?'],'duration');
add(74,'maintain','Object-level security','Report users must be unable to discover or query a sensitive semantic-model column. Which action enforces this?',
 ['Hide the column in model view','Configure role-based object-level security, for example with Tabular Editor','Remove the column from one report visual','Create a perspective excluding the column'],1,
 'OLS restricts access to model objects for a role. Hiding a field or excluding it from a perspective changes discoverability in a UI, but does not prohibit querying it.',
 ['Does hiding something remove permission to query it?','Which choice enforces access at the semantic-model object level?'],'ols',{source:[74,192]});
add(75,'model','Dynamic measure formatting','A numeric measure converts sales to a selected currency. How should you change its currency symbol without turning the result into text?',
 ['Use FORMAT() for the measure value','Use a dynamic format string','Add a field parameter only','Use WINDOW()'],1,
 'A dynamic format string changes how a numeric result is displayed while preserving its numeric type. FORMAT returns text, which affects numeric visuals and further calculations.',
 ['Is the requirement about calculating a value or displaying it?','Which option preserves numeric behavior?'],'format');
add(76,'prepare','Choosing a data store','Which Fabric store supports T-SQL data writes, transactions across multiple tables, and dynamic data masking?',
 ['Lakehouse SQL analytics endpoint','Warehouse','Semantic model','KQL queryset'],1,
 'A warehouse supplies the relational T-SQL write and transaction capabilities in this scenario. The lakehouse SQL analytics endpoint is not a T-SQL writer for lakehouse tables.',
 ['Which requirement rules out a read-only SQL endpoint?','Which store is built for relational transaction processing within analytics workloads?'],'warehouse');
add(80,'model','Python visual row grouping','A Power BI Python visual groups identical selected rows before passing data to the script. How can you retain each source row?',
 ['Add a unique row identifier to the visual fields','Sort the columns alphabetically','Reference columns by index','Remove all fields from the visual'],0,
 'Including a unique identifier makes each input row distinct, preventing identical selected field combinations from collapsing during grouping.',
 ['At what point are identical rows being collapsed?','What additional field would make every selected row distinct?'],'python');
add(83,'maintain','Least-privilege workspace roles','Evaluate these workspace-role assignments against the requirements.',[],[true,true,false],
 'Contributor can author content without managing workspace membership. Admin can manage workspace settings and delete the workspace. Member can author and add Members or lower, but cannot add Admins or delete the workspace.',
 ['Which role is the first that allows content authoring?','Which role can add people without owning all workspace administration?'],'roles',
 {type:'yn',stmts:['Contributor fits authors who must not add workspace members.','Admin fits users who must manage all workspace settings.','Viewer fits users who must author content and add Members.']});
add(87,'prepare','Script activity output','A pipeline must execute SQL that returns customer statistics and pass the result set downstream. Lookup is not among the available choices. Which activity supports this?',
 ['Append variable','Script configured as Query','Stored procedure activity with no result-set output','Get metadata'],1,
 'A Script activity in Query mode can expose returned result sets. Merely running a procedure without capturing its results does not satisfy the downstream-value requirement.',
 ['What output does the next activity actually need?','Which SQL activity explicitly supports query result sets?'],'script');
add(91,'model','DAX query output','Which DAX query returns the Stores rows opened after December 1, 2023?',
 ["EVALUATE FILTER(Stores, Stores[OpenDate] > DATE(2023,12,1))","RETURN YEAR(Stores[OpenDate])","EVALUATE SUM(Stores[OpenDate])","DEFINE Stores[OpenDate] > DATE(2023,12,1)"],0,
 'A DAX query uses EVALUATE with a table expression. FILTER returns the matching Stores rows; a scalar aggregation does not return the requested table.',
 ['Does the query need to return a scalar or a table?','Which keyword emits a table expression in a DAX query?'],'evaluate');
add(92,'model','XMLA write performance','A capacity-backed semantic model receives frequent XMLA writes. Which model storage setting can improve these write operations?',
 ['Large semantic model storage format','Disable all relationships','Convert all columns to text','Delete unrelated workspace models'],0,
 'Large semantic model storage format improves supported XMLA write operations. It is a storage setting, not a requirement to change the model to Direct Lake.',
 ['Which choice changes how this model is stored?','Would removing an unrelated model change this model format?'],'large');
add(93,'maintain','Versioned Power BI projects','A team wants editable text model definitions and workspace version history with branching. Which TWO actions fit?',
 ['Save as PBIP','Connect the workspace to Git','Save only as PBIT','Use Publish to web'],[0,1],
 'PBIP exposes project definitions as text files suitable for editing and diffing. Workspace Git integration supports version history and branching for supported items. PBIT is a template format, and public report publishing is unrelated.',
 ['Which file format makes definitions readable by text tools?','What records revisions and branches once those files exist?'],'pbip');
add(94,'maintain','XMLA writes','Tabular Editor must publish model changes through XMLA on a Fabric capacity. Which capacity setting is required?',
 ['XMLA Endpoint: Read Write','Enable external sharing','Create a workspace private endpoint','Turn off Git integration'],0,
 'The capacity XMLA endpoint must permit Read Write. The caller still needs the relevant model permissions; enabling writes does not grant every user access.',
 ['Is connecting to read metadata enough to publish changes?','Which setting controls whether XMLA writes are accepted?'],'xmla',{source:[94,113]});
add(100,'prepare','Visual query aggregation','A query must return total SalesAmount for each ProductCategory during the last quarter. Which TWO operations are needed?',
 ['Filter TransactionDate to last quarter','Group by ProductCategory and sum SalesAmount','Keep the first 90 rows','Remove duplicate dates'],[0,1],
 'A date filter selects the period; grouping and summing computes totals by category. Ninety rows are not ninety days, and removing repeated dates loses legitimate sales.',
 ['Is a row count a reliable way to select a time period?','What operation combines many sales into one total per category?'],'sql');
add(108,'model','Many-to-many dimensions','Customers can share bank accounts, and each customer can own multiple accounts. Transactions relate to accounts. How should you model customer-account membership?',
 ['A bridge table with CustomerKey and AccountKey linked to the two dimensions','One CustomerKey in each transaction, ignoring shared accounts','A relationship on customer names','Duplicate every account table for each customer'],0,
 'The bridge records one row per customer-account association. Configure relationships and filter propagation deliberately so customer filters reach the account transactions. Shared accounts also mean customer totals need not be additive.',
 ['Can one CustomerKey represent a jointly owned account?','Where can you store each valid customer-account pair?'],'bridge');
add(109,'model','Incremental refresh and folding','Incremental refresh over daily CSV files still consumes excessive resources. Which issue can explain this?',
 ['Date filters are not pushed to the source, so large amounts are read repeatedly','XMLA is read-only, preventing all scheduled refreshes','The model has a date column','The source applies all filters efficiently'],0,
 'Incremental policies do not guarantee efficient source reads. CSV sources typically cannot execute folded queries, so partition refreshes may repeatedly scan data. Inspect the actual query and source-reading behavior.',
 ['Does partitioning the model guarantee the source reads only each partition?','Where are the date filters executed when the source cannot run a query?'],'incremental',{source:[109,119]});
add(115,'maintain','Editable TMDL projects','Which Power BI Desktop save format is intended for project files whose semantic-model definitions can be edited in Visual Studio Code?',
 ['PBIP','PBIX','PBIT','PBIDS'],0,
 'PBIP saves a project with separate report and semantic-model definitions. PBIDS stores connection information; PBIX is the packaged report file and PBIT is a template.',
 ['Do you need connection details or editable model definitions?','Which choice is the Power BI project format?'],'pbip');
add(118,'model','DirectQuery aggregations','A large DirectQuery fact table powers many report visuals. Which TWO features can answer suitable queries from cached summaries?',
 ['User-defined aggregations','Automatic aggregations','OneLake integration alone','Changing the report theme'],[0,1],
 'User-defined and automatic aggregations can serve eligible queries from summarized data, reducing expensive detail-source requests. Benefits depend on query coverage, refresh, and configuration.',
 ['Could a summary answer the visual without reading all detail rows?','Which choices create or manage those summaries?'],'aggregation');
add(120,'model','Semantic model scale-out','Before enabling supported semantic-model scale-out, which model storage setting must be enabled?',
 ['Large semantic model storage format','Publish to web','Disable relationships','Turn off all refreshes'],0,
 'Scale-out requires large semantic model storage format in a supported capacity and configuration. Public sharing and relationship removal are unrelated prerequisites.',
 ['Which prerequisite concerns model storage rather than report access?','What format supports the scale-out model architecture?'],'scale');
add(121,'model','Direct Lake fallback','A Direct Lake on SQL endpoints model must enforce warehouse SQL RLS, with fallback allowed. Which mode executes queries that require that SQL security?',
 ['DirectQuery','Import','Dual','Direct Lake without consulting SQL security'],0,
 'Direct Lake on SQL endpoints falls back to DirectQuery when warehouse SQL RLS must be applied. This is scoped to that Direct Lake variant; Direct Lake on OneLake has different security behavior.',
 ['Where is the security rule enforced in this scenario?','Which mode routes the query through the SQL endpoint?'],'lake');
add(122,'model','Model layouts','You need a diagram showing Sales and its related tables without removing other tables from the semantic model. Which Power BI Desktop feature fits?',
 ['A custom layout in Model view','Delete unrelated tables','A data category','A report-page filter'],0,
 'Model view supports layouts containing selected tables. A layout changes the diagram, not the set of tables stored in the model.',
 ['Are you changing the model or only its diagram?','Which view manages table relationships and layouts?'],'layout');
add(124,'model','Direct Lake memory inspection','You need to investigate which Direct Lake column segments are resident in memory. Which tool or interface is appropriate?',
 ['$SYSTEM.DISCOVER_STORAGE_TABLE_COLUMN_SEGMENTS via XMLA','A report color theme','The workspace description','A CSV export of one report visual'],0,
 'The storage-column-segment DMV exposes storage-engine segment information for memory analysis. A report export shows query results, not the model residency details.',
 ['Do you need business rows or storage-engine metadata?','Which interface exposes model internals rather than one visual result?'],'memory');
add(129,'prepare','Replacing lakehouse data','A Copy activity must replace both the destination lakehouse table data and its schema with the incoming data. Which destination table action fits?',
 ['Append','Overwrite','Enable staging only','Add source columns only'],1,
 'Overwrite replaces the target table content and schema as supported by the lakehouse connector. Append retains existing data and does not mean replacing the destination schema.',
 ['Should existing rows survive this load?','Which action means replacement rather than addition?'],'copy');
add(130,'prepare','SQL over external Delta','An S3 source should be queryable through a lakehouse SQL analytics endpoint without copying its data. Which TWO choices fit?',
 ['Use Delta table format','Create a shortcut in Tables','Use arbitrary CSV files in Files','Create only a Files shortcut'],[0,1],
 'A Tables shortcut to a supported Delta table makes the table discoverable through the lakehouse SQL analytics endpoint. A Files shortcut to arbitrary files does not itself register a SQL table.',
 ['Does the endpoint query arbitrary files or registered tables?','Which format includes the table transaction metadata the lakehouse expects?'],'shortcut');
add(132,'prepare','Changing table partitioning','A Copy activity will replace an existing unpartitioned lakehouse table with data partitioned by a source date column. Which destination mode allows you to specify the new partitioning?',
 ['Append','Overwrite','Read only','Enable source partition discovery alone'],1,
 'Overwrite allows the destination table to be recreated with the chosen partition column. Appending to an existing table does not redefine its partition layout.',
 ['Are you adding rows to the same layout or changing the table layout?','Which mode recreates the destination?'],'copy');
add(174,'prepare','Delta retention','You must remove obsolete Delta files no longer referenced by the table while preserving a 30-day retention period. Which operation fits?',
 ['Delete files manually in OneLake','VACUUM with an appropriate 720-hour retention','OPTIMIZE alone','DROP TABLE'],1,
 'VACUUM removes eligible unreferenced files according to retention. Thirty days equals 720 hours. Manual deletion can corrupt the table; OPTIMIZE rewrites layout but does not replace retention-aware cleanup. Retention also affects time travel.',
 ['Are the files still part of the current table version?','Which operation understands the Delta log and a retention threshold?'],'vacuum');
add(176,'prepare','Fuzzy merge','Two text-key queries must be inner joined while tolerating spacing differences. Which low-code operation supports this?',
 ['Append queries','Merge with fuzzy matching and the relevant text-combination option','Sort both queries','Remove all spaces from every column indiscriminately'],1,
 'Merge joins rows by matching keys. Fuzzy matching supports options for text differences, including combining text parts. Append stacks rows and does not join by keys; check matches to avoid unintended associations.',
 ['Are you stacking rows or matching rows across two tables?','Which merge options can treat separated text parts as equivalent?'],'fuzzy');
add(182,'prepare','Cross-workspace data reuse','Two lakehouses in different workspaces contain Sales and Customers Delta tables. You want one SQL query to use both without duplicating table data. What can bring the remote table into the querying lakehouse?',
 ['A Tables shortcut to the other lakehouse table','A daily copy of the whole table','An unrelated report measure','An empty managed table'],0,
 'A OneLake Tables shortcut exposes the remote Delta table without maintaining a separate copied dataset. Access to the source and the shortcut must still be configured.',
 ['Do you need another copy or a reference to existing data?','Which OneLake feature exposes a remote table locally?'],'shortcut');
add(183,'prepare','Type 2 dimension columns','A customer dimension must preserve each version of customer attributes. The source already has the natural customer key. Which THREE additional column types support Type 2 history?',
 ['Surrogate key for each version','Effective start date/time','Effective end date/time','A replacement natural key with no version distinction','A sales amount'],[0,1,2],
 'A surrogate key distinguishes dimension versions. Effective start and end times describe when each version applies. The natural key still identifies the customer across versions.',
 ['How do two historical versions of the same customer get different identities?','How will a transaction date choose the right historical version?'],'star');
add(184,'prepare','Pipeline dependencies','Activity B should run after activity A finishes whether A succeeds or fails. Which conditional path is appropriate?',
 ['Upon Success','Upon Failure','Upon Completion','Upon Skip'],2,
 'Upon Completion covers success and failure of the preceding activity. Upon Failure omits the success case, and Upon Skip addresses an activity that did not run.',
 ['Must B run for one outcome or both success and failure?','Which dependency describes finishing rather than a particular result?'],'path');
add(185,'model','Automated model rules','You need to flag key columns whose Summarize By property is not None using a reusable rule across a model. Which tool fits?',
 ['DAX Formatter','Tabular Editor Best Practice Analyzer','Performance Analyzer visual durations','A report slicer'],1,
 'Best Practice Analyzer evaluates model metadata against rules. A rule can identify key columns with unwanted summarization. Formatting DAX does not inspect those column properties.',
 ['Is this a query-speed problem or a metadata rule?','Which tool evaluates reusable rules over model objects?'],'bpa');
add(186,'model','DAX performance investigation','Put these actions in order to find a slow report query and compare formula-engine versus storage-engine time.',[],[0,1,2,3,4],
 'First capture the report interaction with Performance Analyzer and obtain the slow visual query. Then run it in DAX Studio with Server Timings enabled to examine engine activity. Total visual duration also includes work outside DAX.',
 ['Where do you first identify the slow report visual?','Can you compare engine timings before capturing and running the relevant DAX?'],'perf',
 {type:'order',items:['Start Performance Analyzer recording','Refresh the relevant visuals and identify the slow DAX query','Copy that visual\'s DAX query','Connect DAX Studio and enable Server Timings','Run the captured query and inspect engine timings']});
add(187,'model','Bulk model changes','You need a script that finds every column ending in Key and changes its model properties, such as IsHidden and SummarizeBy. Which tool fits?',
 ['Tabular Editor advanced scripting','DAX Studio result export','A report visual','Power Query row filters'],0,
 'Tabular Editor scripts can iterate over model objects and edit their metadata. Querying or exporting business data does not change those model properties. Review changes before applying them.',
 ['Are you changing rows of data or properties of model objects?','Which tool exposes a scripting API for those objects?'],'scripting');
add(189,'model','Calculation groups','A calculation item must evaluate whichever measure is selected for the month-to-date date context. Which expression fits?',
 ["CALCULATE(SELECTEDMEASURE(), DATESMTD('Date'[Date]))","SUM('Date'[Month])","SELECTEDMEASURENAME()","FORMAT(SELECTEDMEASURE(), \"0\")"],0,
 'SELECTEDMEASURE refers to the measure being evaluated. CALCULATE applies the month-to-date dates to that measure. Its name is text and cannot replace its numeric evaluation.',
 ['How can one calculation item refer to many different measures?','Which part changes the date context rather than the measure name?'],'calc');
add(191,'model','Disabling DirectQuery fallback','A Direct Lake on SQL endpoints model must never silently fall back to DirectQuery. Which setting enforces this?',
 ['DirectLakeBehavior = DirectLakeOnly','Default Mode = Import','Remove every date filter','DirectLakeBehavior = Automatic'],0,
 'DirectLakeOnly prevents DirectQuery fallback. Queries that cannot be served in Direct Lake fail instead; the setting does not remove capacity or feature limitations.',
 ['What should happen if Direct Lake cannot answer a query?','Does Automatic prohibit fallback or allow the engine to choose?'],'lake');
add(193,'model','Efficient DAX filters','For an Import model, which pattern can replace FILTER over a table when the condition is a simple predicate on one column and existing filters should intersect?',
 ["CALCULATE([Sales], KEEPFILTERS(Product[Color] = \"Red\"))","Remove all filters with ALL()","Convert the condition into a text string","Use a nested CALCULATE inside every row predicate"],0,
 'A Boolean column predicate can use the column store efficiently. KEEPFILTERS preserves intersection with existing context. The rewrite is not universal: measure-based or complex multi-table predicates may still require FILTER.',
 ['Does this condition require inspecting a whole table row by row?','How can you keep an existing color filter while adding Red?'],'filters');
add(194,'maintain','Testing dynamic RLS','An HR manager sees incomplete data under dynamic RLS. What is the most relevant validation in the service?',
 ['Use Test as role and test as the specific HR manager','Apply a similar report filter manually','Ask an Admin to check their unrestricted view','Disable RLS permanently'],0,
 'Test the actual role with the manager identity so identity-dependent filters are evaluated. A manual report filter does not reproduce the security context, and an Admin view may bypass RLS.',
 ['Does the role use the current user identity in its logic?','Would your own identity reproduce this manager\'s result?'],'test');
