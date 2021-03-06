import React, { FunctionComponent, useContext, useState, useRef } from "react";
import { SectionLoading } from "app/components/loading";
import { AjaxButton } from "app/components/bootstrapButton";

import PublicUserSettingsQuery from "graphQL/settings/getPublisUserSettingsQuery.graphql";
import UpdatePublisUserSettingsMutation from "graphQL/settings/updatePublicUserSettings.graphql";
import { useQuery, buildQuery, useMutation, buildMutation } from "micro-graphql-react";
import { AppContext } from "app/renderUI";
import { QueryOf, Queries, MutationOf, Mutations } from "graphql-typings";

const PublicUserSettings: FunctionComponent<{}> = props => {
  const [{ online }] = useContext(AppContext);
  const { loading, loaded, data } = useQuery<QueryOf<Queries["getUser"]>>(buildQuery(PublicUserSettingsQuery, {}, { active: online }));

  if (!online) {
    return <h1>Offline</h1>;
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-6 col-sm-12" style={{ position: "relative", minHeight: "200px" }}>
          {!loaded ? <SectionLoading style={{ left: "20%" }} /> : <EditPublicUserSettings settings={data.getUser.User} />}
        </div>
      </div>
    </div>
  );
};

interface UserSettings {
  isPublic: boolean;
  publicBooksHeader: string;
  publicName: string;
}

const EditPublicUserSettings: FunctionComponent<{ settings: UserSettings }> = props => {
  const [app] = useContext(AppContext);
  const { runMutation, running: saving } = useMutation<MutationOf<Mutations["updateUser"]>>(buildMutation(UpdatePublisUserSettingsMutation));
  const { settings } = props;
  const { publicBooksHeader, publicName } = settings;
  const [pendingIsPublic, setPendingIsPublic] = useState(settings.isPublic);
  const [isPublic, setIsPublic] = useState(settings.isPublic);
  const [isDirty, setDirtyState] = useState(false);
  const setDirty = () => setDirtyState(true);

  const publicLink = isPublic ? `http://${window.location.host}/view?userId=${app.userId}` : "";

  const pubNameEl = useRef(null);
  const pubHeaderEl = useRef(null);

  const update = () => {
    let isPublic = pendingIsPublic;
    runMutation({
      isPublic: pendingIsPublic,
      publicBooksHeader: pubHeaderEl.current ? pubHeaderEl.current.value : "",
      publicName: pubNameEl.current ? pubNameEl.current.value : ""
    }).then(() => {
      setIsPublic(isPublic);
      setDirtyState(false);
    });
  };

  return (
    <div style={{ paddingLeft: "10px", paddingTop: "20px" }}>
      {publicLink ? (
        <div style={{ marginBottom: "20px" }}>
          Your collection is currently public, viewable at <br />
          <br />
          <a target="_blank" href={publicLink}>
            {publicLink}
          </a>
        </div>
      ) : null}

      <hr />

      <div className="checkbox-group" style={{ marginTop: "15px" }}>
        <label className="checkbox">
          Allow your book collection to be viewed publicly?
          <input
            onChange={evt => {
              setDirty();
              setPendingIsPublic(evt.target.checked);
            }}
            defaultChecked={pendingIsPublic}
            disabled={saving}
            style={{ marginLeft: "5px" }}
            type="checkbox"
          />
        </label>
      </div>
      {pendingIsPublic ? (
        <div style={{ marginLeft: "20px" }}>
          <div className="form-group">
            <label htmlFor="pName">Publicly display your name as</label>
            <input
              ref={pubNameEl}
              onChange={setDirty}
              defaultValue={publicName}
              disabled={saving}
              className="form-control"
              id="pName"
              placeholder="Public name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="publicBooksHeader">Publicly display your collection as</label>
            <input
              ref={pubHeaderEl}
              onChange={setDirty}
              defaultValue={publicBooksHeader}
              disabled={saving}
              className="form-control"
              id="publicBooksHeader"
              placeholder="Book header"
            />
          </div>
          <AjaxButton disabled={!isDirty} onClick={update} runningText="Saving" finishedText="Saved" preset="primary">
            Save
          </AjaxButton>
        </div>
      ) : null}
    </div>
  );
};

export default PublicUserSettings;
