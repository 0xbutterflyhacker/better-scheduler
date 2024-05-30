import React from "react";
import * as ReactDOM from "react-dom/client";
import { dbClient } from "./dbClient";
import { Database } from "./dbTypes";
// import { Auth } from "@supabase/auth-ui-react";
// import { ThemeSupa } from "@supabase/auth-ui-shared";

type mainCourse = Database["public"]["Tables"]["courses"]["Row"];

ReactDOM.createRoot(document.querySelector("#root")!).render(<App />);

export default function App() {
	const [courses, setCourses] = React.useState<mainCourse[]>([]);
	// const [session, setSession] = React.useState(null);
	React.useEffect(() => {
		getAllCourses();
	}, []);
	async function getAllCourses() {
		const { data } = await dbClient.from("courses").select();
		setCourses(data!);
	}
	// React.useEffect(() => {
	// 	dbClient.auth.getSession().then(({ data: { session } }) => {
	// 		setSession(session);
	// 	});

	// 	const {
	// 		data: { subscription },
	// 	} = dbClient.auth.onAuthStateChange((_event, session) => {
	// 		setSession(session);
	// 	});

	// 	return () => subscription.unsubscribe();
	// }, []);
	// if (!session)
	// 	return <Auth supabaseClient={dbClient} appearance={{ theme: ThemeSupa }} />;
	// async function logout() {
	// 	await dbClient.auth.signOut();
	// }

	const c = courses.map((course) => (
		<>
			<CourseComp course={course} key={course["id"]} />
		</>
	));
	return (
		<div className="p-2">
			{/* <nav>
				<ul>
					<li onClick={logout}>log out.</li>
				</ul>
			</nav> */}
			{c}
		</div>
	);
}

function CourseComp(props: { course: mainCourse }) {
	const prereqs = props.course["prerequisites"]
		?.toString()
		.split(/,/)
		.map((p) => <li key={p}>{p}</li>);
	const coreqs = props.course["corequisites"]
		?.toString()
		.split(/,/)
		.map((p) => (
			<li key={p}>
				<em>{p}</em>
			</li>
		));
	return (
		<div
			id="course-box"
			className="p-3 border-solid border-2 border-green-500 mb-2">
			<h2>{`${props.course["subject"]} ${props.course["course_number"]} - ${props.course["title"]}`}</h2>
			<hr />
			<em>{props.course["description"]}</em>
			<br />
			<br />
			<strong>Prerequisites:</strong>
			{prereqs ? (
				<ul>{prereqs}</ul>
			) : (
				<>
					<br />
					<em>No prerequisites.</em>
					<br />
				</>
			)}
			<strong>Corequisites:</strong>
			{coreqs ? (
				<ul>{coreqs}</ul>
			) : (
				<>
					<br />
					<em>No corequisites.</em>
				</>
			)}
			<h3>Section Information</h3>
			<hr />
			<i>Section Count: {props.course.sections?.length ?? "0"}</i>
			<SectionInfo course={props.course} />
			{!props.course["lab_section"] ? (
				<button disabled={true}>
					This course has no supplemental sections.
				</button>
			) : (
				<button>
					This course has supplemental sections, one of which{" "}
					<strong>must</strong> be registered for at the same time as the main
					course section.
				</button>
			)}
		</div>
	);
}
function SectionInfo(props: { course: mainCourse }) {
	const sections = props.course.sections?.map((section, index) => (
		<div key={section}>
			<button>
				Section {section} --{" "}
				{props.course["capacity"]?.at(2 * index + 1) ?? "0"} seats remain out of{" "}
				{props.course["capacity"]?.at(2 * index) ?? "0"} total.
			</button>
			<div
				id={`${props.course.subject}${props.course.course_number}-${section}`}>
				Professor:{" "}
				{props.course.professor.length == 1
					? props.course.professor.at(0)
					: props.course.professor.at(index)}
				<br />
				<div className="flex flex-col">
					Meetings:{" "}
					{props.course.meetings ? (
						<CalendarProp meetings={props.course.meetings} index={index} />
					) : (
						"No meetings assigned."
					)}
				</div>
			</div>
		</div>
	));
	return <>{sections}</>;
}
function CalendarProp(props: { meetings: object; index: number }) {
	const schedule = Object.values(props.meetings).at(props.index);
	const week_template = ["S", "M", "T", "W", "TH", "F", "S"];
	const week: React.JSX.Element[] = week_template.map((day, index) => (
		<>
			<div
				style={{
					backgroundColor: Object.hasOwn(schedule, index) ? "green" : "gray",
				}}
				key={index}>
				{day}
			</div>
		</>
	));
	// if (props.meetings) console.log(Object.keys(props.meetings));
	return <div className="flex flex-row">{week}</div>;
}
