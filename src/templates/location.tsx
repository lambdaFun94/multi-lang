/**
 * This is an example of how to create a template that makes use of streams data.
 * The stream data originates from Yext's Knowledge Graph. When a template in
 * concert with a stream is built by the Yext Sites system, a static html page
 * is generated for every corresponding (based on the filter) stream document.
 *
 * Another way to think about it is that a page will be generated using this
 * template for every eligible entity in your Knowledge Graph.
 */

import * as React from "react";
import Banner from "../components/banner";
import Cta from "../components/cta";
import Contact from "../components/contact";
import List from "../components/list";
import Hours from "../components/hours";
import StaticMap from "../components/static-map";
import "../index.css";
import {
  Template,
  GetPath,
  TemplateConfig,
  TemplateProps,
  TemplateRenderProps,
  GetHeadConfig,
  HeadConfig,
} from "@yext/pages";
import PageLayout from "../components/page-layout";


/**
 * Required when Knowledge Graph data is used for a template.
 */
export const config: TemplateConfig = {
  stream: {
    $id: "my-stream-id-1",
    fields: [
      "id",
      "uid",
      "meta",
      "name",
      "address",
      "mainPhone",
      "description",
      "hours",
      "slug",
      "geocodedCoordinate",
      "services",
    ],
    filter: {
      entityTypes: ["location"]
    },
    localization: {
      locales: ["en", "es"],
      primary: false,
    },
  }
};

/**
 * Defines the path that the generated file will live at for production.
 *
 * NOTE: This currently has no impact on the local dev path. Local dev urls currently
 * take on the form: featureName/entityId
 */
export const getPath: GetPath<TemplateProps> = ({ document }) => {
  return document.slug;
};


/**
 * This allows the user to define a function which will take in their template
 * data and procude a HeadConfig object. When the site is generated, the HeadConfig
 * will be used to generate the inner contents of the HTML document's <head> tag.
 * This can include the title, meta tags, script tags, etc.
 */
export const getHeadConfig: GetHeadConfig<TemplateRenderProps> = ({
  document,
}): HeadConfig => {
  return {
    title: document.name,
    charset: "UTF-8",
    viewport: "width=device-width, initial-scale=1",
    tags: [
      {
        type: "meta",
        attributes: {
          description: "This site was generated by the Yext SSG",
        },
      },
    ],
  };
};

/**
 * This is the main template. It can have any name as long as it's the default export.
 * The props passed in here are the direct stream document defined by `config`.
 *
 * There are a bunch of custom components being used from the src/components folder. These are
 * an example of how you could create your own. You can set up your folder structure for custom
 * components any way you'd like as long as it lives in the src folder (though you should not put
 * them in the src/templates folder as this is specific for true template files).
 */
const Location: Template<TemplateRenderProps> = ({
  relativePrefixToRoot,
  path,
  document,
}) => {
  const {
    _site,
    name,
    address,
    openTime,
    hours,
    description,
    mainPhone,
    geocodedCoordinate,
    services,
  } = document;

  return (
    <>
      <PageLayout _site={_site}>
        <Banner name={name} address={address} openTime={openTime}>
          <div className="bg-white h-40 w-1/5 flex items-center justify-center text-center flex-col space-y-4 rounded-lg">
            <div className="text-black text-base">Visit Us Today!</div>
            <Cta
              buttonText="Get Directions"
              url="http://google.com"
              style="primary-cta"
            />
          </div>
        </Banner>
        <div className="centered-container">
          <div className="section">
            <div className="grid grid-cols-3 gap-x-10 gap-y-10">
              <div className="bg-gray-100 p-5 space-y-12">
                <Contact address={address} phone={mainPhone}></Contact>
                {services && <List list={services}></List>}
              </div>
              <div className="col-span-2 pt-5 space-y-10">
                <div>
                  {hours && <Hours title={"Restaurant Hours"} hours={hours} />}
                </div>
                <div>
                  {description}
                </div>
                {geocodedCoordinate && (
                  <StaticMap
                    latitude={geocodedCoordinate.latitude}
                    longitude={geocodedCoordinate.longitude}
                  ></StaticMap>
                )}
              </div>
            </div>
          </div>
        </div>
      </PageLayout>
    </>
  );
};

export default Location;
